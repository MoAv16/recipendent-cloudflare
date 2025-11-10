-- ============================================================================
-- RECIPENDENT APP - STORAGE FILE MIGRATION SCRIPT
-- ============================================================================
-- Migriert bestehende Files in profile-pictures bucket zur neuen Struktur
-- Alte Struktur: user-avatars/filename.jpg oder loose files
-- Neue Struktur: {company_id}/{user_id}/filename.jpg
-- ============================================================================

-- WICHTIG: Dieses Script kann nicht direkt in SQL ausgeführt werden!
-- Storage File Operations müssen über die Supabase Storage API erfolgen.
-- Dieses Script dient als Referenz für manuelle Migration oder JavaScript/Python Script.

-- ============================================================================
-- SCHRITT 1: Identifiziere alle Files die migriert werden müssen
-- ============================================================================

-- Zeige alle profile-pictures die NICHT der neuen Struktur entsprechen
SELECT
  name as current_path,
  id,
  created_at,
  metadata
FROM storage.objects
WHERE bucket_id = 'profile-pictures'
  -- Files die nicht dem Pattern {uuid}/{uuid}/filename entsprechen
  AND NOT (
    name ~ '^[a-f0-9-]{36}/[a-f0-9-]{36}/.+$'
  );

-- ============================================================================
-- SCHRITT 2: Mapping von Files zu Users (für manuelle Zuordnung)
-- ============================================================================

-- Liste aller User mit deren aktuellen profile_picture URLs
SELECT
  u.id as user_id,
  u.company_id,
  u.first_name,
  u.last_name,
  u.profile_picture,
  -- Extrahiere Filename aus URL
  CASE
    WHEN u.profile_picture LIKE '%profile-pictures%' THEN
      regexp_replace(u.profile_picture, '.*profile-pictures/', '')
    ELSE NULL
  END as current_filename
FROM public.users u
WHERE u.profile_picture IS NOT NULL
ORDER BY u.company_id, u.created_at;

-- ============================================================================
-- SCHRITT 3: Manuelle Migration via Supabase Dashboard oder API
-- ============================================================================

-- FÜR JEDE FILE DIE MIGRIERT WERDEN MUSS:

-- 1. Identifiziere den User anhand der profile_picture URL
-- 2. Lade die alte File herunter (via Storage API)
-- 3. Upload unter neuem Pfad: {company_id}/{user_id}/{original_filename}
-- 4. Update users.profile_picture mit neuer URL
-- 5. Lösche alte File

-- ============================================================================
-- BEISPIEL UPDATE FÜR USERS TABELLE (nach Migration)
-- ============================================================================

-- Template für Update nach erfolgreicher File-Migration
-- REPLACE <user_id>, <new_storage_url> mit echten Werten

-- UPDATE public.users
-- SET profile_picture = '<new_storage_url>'
-- WHERE id = '<user_id>';

-- ============================================================================
-- ALTERNATIVE: JavaScript Migration Script (empfohlen)
-- ============================================================================

/*
VERWENDUNG VIA NODE.JS SCRIPT:

import { createClient } from '@supabase/supabase-js'

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY)

async function migrateProfilePictures() {
  // 1. Hole alle Users mit profile_pictures
  const { data: users, error: usersError } = await supabase
    .from('users')
    .select('id, company_id, profile_picture')
    .not('profile_picture', 'is', null)

  if (usersError) throw usersError

  for (const user of users) {
    if (!user.profile_picture) continue

    // 2. Extrahiere alten Pfad
    const oldPath = user.profile_picture.split('profile-pictures/')[1]
    if (!oldPath) continue

    // 3. Check ob bereits neue Struktur
    if (oldPath.match(/^[a-f0-9-]{36}\/[a-f0-9-]{36}\//)) {
      console.log(`✓ Already migrated: ${oldPath}`)
      continue
    }

    console.log(`Migrating: ${oldPath} for user ${user.id}`)

    // 4. Download alte File
    const { data: fileData, error: downloadError } = await supabase.storage
      .from('profile-pictures')
      .download(oldPath)

    if (downloadError) {
      console.error(`❌ Download failed for ${oldPath}:`, downloadError)
      continue
    }

    // 5. Erstelle neuen Pfad
    const filename = oldPath.split('/').pop() // Original filename
    const newPath = `${user.company_id}/${user.id}/${filename}`

    // 6. Upload unter neuem Pfad
    const { error: uploadError } = await supabase.storage
      .from('profile-pictures')
      .upload(newPath, fileData, {
        contentType: 'image/jpeg',
        upsert: false
      })

    if (uploadError) {
      console.error(`❌ Upload failed for ${newPath}:`, uploadError)
      continue
    }

    // 7. Hole neue Public URL
    const { data: publicUrlData } = supabase.storage
      .from('profile-pictures')
      .getPublicUrl(newPath)

    // 8. Update User record
    const { error: updateError } = await supabase
      .from('users')
      .update({ profile_picture: publicUrlData.publicUrl })
      .eq('id', user.id)

    if (updateError) {
      console.error(`❌ DB update failed for user ${user.id}:`, updateError)
      continue
    }

    // 9. Lösche alte File (optional - erst nach Verify!)
    // const { error: deleteError } = await supabase.storage
    //   .from('profile-pictures')
    //   .remove([oldPath])

    console.log(`✓ Migrated: ${oldPath} → ${newPath}`)
  }

  console.log('Migration complete!')
}

migrateProfilePictures().catch(console.error)
*/

-- ============================================================================
-- MANUELLE MIGRATION VIA SUPABASE DASHBOARD
-- ============================================================================

-- SCHRITTE:
-- 1. Storage > profile-pictures bucket öffnen
-- 2. Für jede loose .jpg File:
--    a) Notiere Filename
--    b) Finde zugehörigen User in users Tabelle (profile_picture Column)
--    c) Erstelle Ordner: company_id/user_id/
--    d) Move File in neuen Ordner
--    e) Update users.profile_picture URL
-- 3. Für user-avatars Ordner:
--    a) Öffne Ordner, liste Files
--    b) Wiederhole Schritte 2a-2e für jede File

-- ============================================================================
-- DEINE SPEZIFISCHEN FILES
-- ============================================================================

-- Du hast folgende Files die migriert werden müssen:
-- - user-avatars/* (Ordner mit Files)
-- - 1762354296896_3hp5oi.jpg
-- - 1762354931518_z2g1ci.jpg
-- - 1762379510742_s1amt.jpg
-- - 1762540986646_8ewdy.jpg

-- Query um herauszufinden welchem User diese Files gehören:
SELECT
  u.id,
  u.company_id,
  u.first_name || ' ' || u.last_name as name,
  u.profile_picture
FROM public.users u
WHERE
  u.profile_picture LIKE '%1762354296896_3hp5oi.jpg%' OR
  u.profile_picture LIKE '%1762354931518_z2g1ci.jpg%' OR
  u.profile_picture LIKE '%1762379510742_s1amt.jpg%' OR
  u.profile_picture LIKE '%1762540986646_8ewdy.jpg%' OR
  u.profile_picture LIKE '%user-avatars%';

-- ============================================================================
-- VERIFICATION NACH MIGRATION
-- ============================================================================

-- Check: Alle profile_pictures sollten neue Struktur haben
SELECT
  COUNT(*) as total_users,
  COUNT(CASE
    WHEN profile_picture IS NULL THEN 1
    WHEN profile_picture ~ '.*profile-pictures/[a-f0-9-]{36}/[a-f0-9-]{36}/' THEN 1
  END) as correct_structure,
  COUNT(CASE
    WHEN profile_picture IS NOT NULL
    AND profile_picture NOT LIKE '%/[a-f0-9-]%/[a-f0-9-]%/%' THEN 1
  END) as needs_migration
FROM public.users;

-- ============================================================================
-- ENDE DER MIGRATION ANLEITUNG
-- ============================================================================
