// ============================================================================
// SUPABASE EDGE FUNCTION: ADMIN REGISTRATION
// ============================================================================
// Diese Function erstellt sicher einen neuen Admin-User mit Company
// Der Service Role Key bleibt sicher im Backend

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

    // Create Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    // Parse request body
    const {
      companyName,
      logoBase64,
      logoExt,
      firstName,
      lastName,
      email,
      password,
      profilePictureBase64,
      profilePictureExt,
      dominantColor,
    } = await req.json();

    console.log('🚀 Starting admin registration for:', email);

    // Validate input
    if (!companyName || !logoBase64 || !logoExt || !firstName || !lastName || !email || !password) {
      return new Response(
        JSON.stringify({ success: false, error: 'Missing required fields' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // ========================================================================
    // STEP 1: Create Auth User
    // ========================================================================
    console.log('📝 Step 1: Creating auth user...');
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin
      user_metadata: {
        first_name: firstName,
        last_name: lastName,
      },
    });

    if (authError || !authData.user) {
      console.error('❌ Auth user creation error:', authError);
      return new Response(
        JSON.stringify({ success: false, error: 'Fehler bei der Registrierung: ' + authError?.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userId = authData.user.id;
    console.log('✅ Auth user created:', userId);

    try {
      // ======================================================================
      // STEP 2: Create Company (without logo)
      // ======================================================================
      console.log('🏢 Step 2: Creating company...');
      const { data: companyData, error: companyError } = await supabaseAdmin
        .from('companies')
        .insert([
          {
            name: companyName,
            logo: null, // Will be updated after upload
            dominant_color: dominantColor || '#2196F3',
          },
        ])
        .select()
        .single();

      if (companyError || !companyData) {
        console.error('❌ Company creation error:', companyError);
        throw new Error('Fehler beim Erstellen des Unternehmens: ' + companyError?.message);
      }

      const companyId = companyData.id;
      console.log('✅ Company created:', companyId);

      // ======================================================================
      // STEP 3: Upload Logo
      // ======================================================================
      console.log('🖼️ Step 3: Uploading logo...');

      // Decode base64
      const logoBytes = Uint8Array.from(atob(logoBase64), c => c.charCodeAt(0));
      const logoFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${logoExt}`;
      const logoFilePath = `${companyId}/${logoFileName}`;

      const { error: logoUploadError } = await supabaseAdmin.storage
        .from('company-logos')
        .upload(logoFilePath, logoBytes, {
          contentType: `image/${logoExt}`,
          upsert: false,
        });

      if (logoUploadError) {
        console.error('❌ Logo upload error:', logoUploadError);
        throw new Error('Fehler beim Hochladen des Logos: ' + logoUploadError.message);
      }

      // Get public URL
      const { data: logoUrlData } = supabaseAdmin.storage
        .from('company-logos')
        .getPublicUrl(logoFilePath);

      const logoUrl = logoUrlData.publicUrl;
      console.log('✅ Logo uploaded:', logoUrl);

      // ======================================================================
      // STEP 4: Upload Profile Picture (optional)
      // ======================================================================
      let profilePictureUrl = null;
      if (profilePictureBase64 && profilePictureExt) {
        console.log('📸 Step 4: Uploading profile picture...');

        const profileBytes = Uint8Array.from(atob(profilePictureBase64), c => c.charCodeAt(0));
        const profileFileName = `${Date.now()}_${Math.random().toString(36).substring(7)}.${profilePictureExt}`;
        const profileFilePath = `${companyId}/${userId}/${profileFileName}`;

        const { error: profileUploadError } = await supabaseAdmin.storage
          .from('profile-pictures')
          .upload(profileFilePath, profileBytes, {
            contentType: `image/${profilePictureExt}`,
            upsert: false,
          });

        if (!profileUploadError) {
          const { data: profileUrlData } = supabaseAdmin.storage
            .from('profile-pictures')
            .getPublicUrl(profileFilePath);
          profilePictureUrl = profileUrlData.publicUrl;
          console.log('✅ Profile picture uploaded:', profilePictureUrl);
        } else {
          console.warn('⚠️ Profile picture upload failed:', profileUploadError);
        }
      }

      // ======================================================================
      // STEP 5: Update Company with Logo URL
      // ======================================================================
      console.log('🔄 Step 5: Updating company with logo URL...');
      const { error: updateError } = await supabaseAdmin
        .from('companies')
        .update({ logo: logoUrl })
        .eq('id', companyId);

      if (updateError) {
        console.warn('⚠️ Company update error:', updateError);
      } else {
        console.log('✅ Company updated with logo URL');
      }

      // ======================================================================
      // STEP 6: Create User Entry
      // ======================================================================
      console.log('👤 Step 6: Creating user entry...');
      const { data: userData, error: userError } = await supabaseAdmin
        .from('users')
        .insert([
          {
            id: userId,
            company_id: companyId,
            first_name: firstName,
            last_name: lastName,
            email: email,
            role: 'admin',
            profile_picture: profilePictureUrl,
          },
        ])
        .select()
        .single();

      if (userError) {
        console.error('❌ User entry creation error:', userError);
        throw new Error('Fehler beim Erstellen des User-Eintrags: ' + userError.message);
      }

      console.log('✅ User entry created');

      // ======================================================================
      // STEP 7: Update user metadata
      // ======================================================================
      console.log('🔄 Step 7: Updating user metadata...');
      await supabaseAdmin.auth.admin.updateUserById(userId, {
        user_metadata: {
          company_id: companyId,
          role: 'admin',
        },
      });
      console.log('✅ User metadata updated');

      console.log('🎉 Admin registration completed successfully!');

      return new Response(
        JSON.stringify({
          success: true,
          data: {
            user: userData,
            company: companyData,
            needsEmailConfirmation: false, // Auto-confirmed
          },
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );

    } catch (error) {
      // ROLLBACK: Delete auth user and company if created
      console.error('❌ Error during registration, rolling back...', error);

      // Try to delete company
      try {
        await supabaseAdmin.from('companies').delete().match({ name: companyName });
      } catch (e) {
        console.error('Failed to rollback company:', e);
      }

      // Delete auth user
      try {
        await supabaseAdmin.auth.admin.deleteUser(userId);
      } catch (e) {
        console.error('Failed to rollback auth user:', e);
      }

      return new Response(
        JSON.stringify({ success: false, error: error.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Unerwarteter Fehler: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
