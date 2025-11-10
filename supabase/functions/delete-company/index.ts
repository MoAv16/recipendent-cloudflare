// ============================================================================
// SUPABASE EDGE FUNCTION: DELETE COMPANY
// ============================================================================
// Löscht Company inkl. aller Storage Files (Logos, Profile Pictures)
// CASCADE DELETE in Database löscht automatisch: users, orders, folders, etc.

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

    // Get Authorization header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ success: false, error: 'Authorization header missing' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify user is authenticated
    const token = authHeader.replace('Bearer ', '');
    const { data: { user }, error: authError } = await supabaseAdmin.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ success: false, error: 'Unauthorized' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get user details from public.users
    const { data: userData, error: userError } = await supabaseAdmin
      .from('users')
      .select('company_id, role')
      .eq('id', user.id)
      .single();

    if (userError || !userData) {
      return new Response(
        JSON.stringify({ success: false, error: 'User not found' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Only admin can delete company
    if (userData.role !== 'admin') {
      return new Response(
        JSON.stringify({ success: false, error: 'Nur Admins können das Unternehmen löschen' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const companyId = userData.company_id;
    console.log('🗑️ Starting company deletion:', companyId);

    // ========================================================================
    // STEP 1: Get all user IDs for this company (for storage cleanup)
    // ========================================================================
    console.log('📋 Step 1: Fetching all users in company...');
    const { data: companyUsers, error: usersError } = await supabaseAdmin
      .from('users')
      .select('id')
      .eq('company_id', companyId);

    if (usersError) {
      console.error('❌ Error fetching users:', usersError);
      return new Response(
        JSON.stringify({ success: false, error: 'Fehler beim Abrufen der Benutzer' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const userIds = companyUsers?.map(u => u.id) || [];
    console.log(`✅ Found ${userIds.length} users to cleanup`);

    // ========================================================================
    // STEP 2: Delete Storage Files (Company Logos)
    // ========================================================================
    console.log('🖼️ Step 2: Deleting company logos...');
    try {
      const { data: logoFiles, error: logoListError } = await supabaseAdmin.storage
        .from('company-logos')
        .list(companyId);

      if (logoListError) {
        console.warn('⚠️ Error listing company logos:', logoListError);
      } else if (logoFiles && logoFiles.length > 0) {
        const logoFilePaths = logoFiles.map(file => `${companyId}/${file.name}`);
        const { error: logoDeleteError } = await supabaseAdmin.storage
          .from('company-logos')
          .remove(logoFilePaths);

        if (logoDeleteError) {
          console.warn('⚠️ Error deleting company logos:', logoDeleteError);
        } else {
          console.log(`✅ Deleted ${logoFilePaths.length} company logo(s)`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Company logo cleanup failed:', error);
    }

    // ========================================================================
    // STEP 3: Delete Storage Files (Profile Pictures)
    // ========================================================================
    console.log('📸 Step 3: Deleting profile pictures...');
    try {
      // List all files in company folder
      const { data: profileFiles, error: profileListError } = await supabaseAdmin.storage
        .from('profile-pictures')
        .list(companyId);

      if (profileListError) {
        console.warn('⚠️ Error listing profile pictures:', profileListError);
      } else if (profileFiles && profileFiles.length > 0) {
        // Profile pictures are in {companyId}/{userId}/ structure
        // We need to recursively delete all subfolders
        for (const userFolder of profileFiles) {
          if (userFolder.id) {
            // It's a folder, list files inside
            const { data: userFiles, error: userFilesError } = await supabaseAdmin.storage
              .from('profile-pictures')
              .list(`${companyId}/${userFolder.name}`);

            if (!userFilesError && userFiles && userFiles.length > 0) {
              const filePaths = userFiles.map(file => `${companyId}/${userFolder.name}/${file.name}`);
              const { error: deleteError } = await supabaseAdmin.storage
                .from('profile-pictures')
                .remove(filePaths);

              if (deleteError) {
                console.warn(`⚠️ Error deleting files in ${userFolder.name}:`, deleteError);
              } else {
                console.log(`✅ Deleted ${filePaths.length} profile picture(s) for user ${userFolder.name}`);
              }
            }
          }
        }
      }
    } catch (error) {
      console.warn('⚠️ Profile pictures cleanup failed:', error);
    }

    // ========================================================================
    // STEP 4: Delete Order Images (if any)
    // ========================================================================
    console.log('🖼️ Step 4: Deleting order images...');
    try {
      const { data: orderImageFiles, error: orderImageListError } = await supabaseAdmin.storage
        .from('order-images')
        .list(companyId);

      if (!orderImageListError && orderImageFiles && orderImageFiles.length > 0) {
        const orderImagePaths = orderImageFiles.map(file => `${companyId}/${file.name}`);
        const { error: orderImageDeleteError } = await supabaseAdmin.storage
          .from('order-images')
          .remove(orderImagePaths);

        if (orderImageDeleteError) {
          console.warn('⚠️ Error deleting order images:', orderImageDeleteError);
        } else {
          console.log(`✅ Deleted ${orderImagePaths.length} order image(s)`);
        }
      }
    } catch (error) {
      console.warn('⚠️ Order images cleanup failed (bucket may not exist):', error);
    }

    // ========================================================================
    // STEP 5: Delete Company from Database (CASCADE handles the rest)
    // ========================================================================
    console.log('🗑️ Step 5: Deleting company from database...');
    const { error: companyDeleteError } = await supabaseAdmin
      .from('companies')
      .delete()
      .eq('id', companyId);

    if (companyDeleteError) {
      console.error('❌ Company deletion error:', companyDeleteError);
      return new Response(
        JSON.stringify({ success: false, error: 'Fehler beim Löschen des Unternehmens: ' + companyDeleteError.message }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('✅ Company deleted from database (CASCADE deleted users, orders, folders, etc.)');

    // ========================================================================
    // SUCCESS
    // ========================================================================
    console.log('🎉 Company deletion completed successfully!');

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Unternehmen erfolgreich gelöscht',
        deletedUsers: userIds.length,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Unexpected error:', error);
    return new Response(
      JSON.stringify({ success: false, error: 'Unerwarteter Fehler: ' + error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
