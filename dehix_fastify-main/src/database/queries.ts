export function newLeadQuery() {
  return `INSERT INTO ${process.env.SERVER_RDS_DB}.lead (id,full_name, email, contact_number,venue_name,status,count,created_at,updated_at) VALUES (?,?,?,?,?,?,?,?,?)
          ON DUPLICATE KEY UPDATE count = count + 1`;
}
export function updateLeadCount() {
  return "UPDATE venue_db.lead SET count = count + 1 WHERE id = ?";
}

export function getAmenities() {
  return `SELECT JSON_ARRAYAGG(
    JSON_OBJECT(
        'amenity_list', amenities,
        'category_type', category_type
    )
) AS result
FROM (
    SELECT category_type,
           JSON_ARRAYAGG(
               JSON_OBJECT(
                   'amenity_id', amenity_id,
                   'is_selected', is_selected,
                   'amenity_name', amenity_name,
                   'venue_amenity_id', venue_amenity_id
               )
           ) AS amenities
    FROM (
        SELECT combined_results.category AS category_type,
               combined_results.category,
               combined_results.amenity_id,
               combined_results.is_selected,
               combined_results.amenity_name,
               combined_results.venue_amenity_id
        FROM (
            SELECT NULL AS venue_amenity_id,
                   id AS amenity_id,
                   name AS amenity_name,
                   a.category,
                   FALSE AS is_selected
            FROM amenity AS a
            WHERE id NOT IN (SELECT amenity_id FROM venue_amenity WHERE amenity_id IS NOT NULL)
            UNION
            SELECT va.id AS venue_amenity_id,
                   a.id AS amenity_id,
                   va.amenity_name AS amenity_name,
                   va.category,
                   va.is_selected
            FROM venue_amenity AS va
            LEFT JOIN amenity AS a ON va.amenity_id = a.id
            WHERE va.entity_type = ? AND va.venue_entity_id = ?
        ) AS combined_results
    ) AS aggregated_data
    WHERE category IN (?)
    GROUP BY category_type
) AS final_result;`;
}

export function getStaticAmenities() {
  return `SELECT 
  category AS "key",
  JSON_ARRAYAGG(
      JSON_OBJECT(
          'amenity_id', id,
          'amenity_name', name,
          'icon', icon,
          'is_selected', false,
          'venue_amenity_id', NULL
      )
  ) AS data
FROM ${process.env.SERVER_RDS_DB}.amenity WHERE category IN (?)
GROUP BY category;`;
}

export function getStaticVenueEventType() {
  return `SELECT 
  category, 
  sub_category, 
  JSON_ARRAYAGG(list) AS data
FROM (
  SELECT 
    category, 
    sub_category, 
    chip_order, 
    category_order,      -- Include category_order
    sub_category_order,  -- Include sub_category_order
    JSON_ARRAYAGG(JSON_OBJECT(
      'event_name', event_name,
      'label', event_name,
      'key', id,
      'event_id', id,
      'venue_event_id', NULL
    )) AS list
  FROM events
  GROUP BY category, sub_category, chip_order, category_order, sub_category_order
  ORDER BY category, sub_category, chip_order
) AS subquery
GROUP BY category, sub_category, category_order, sub_category_order
ORDER BY category_order, sub_category_order;;`;
}
export function getListingFormCongif() {
  return `SELECT * FROM ${process.env.SERVER_RDS_DB}.config WHERE \`key\` LIKE ?`;
}

export function getCreateFreelancerQuery() {
  return `INSERT INTO FREELANCER_team (id, full_name, email, password, is_email_verified, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?,  NOW(), NOW())`;
}

export function getCreateDraftQuery() {
  return `INSERT INTO draft (id, owner_id, form_type, status, created_by, updated_by, created_at, updated_at)
    VALUES (?, ?, ?, ?, ?, ?, NOW(), NOW())`;
}

export function getDrafts(ownerId, formTypes, FREELANCERId) {
  const query = `WITH LatestDrafts AS (
   
    SELECT form_type, MAX(created_at) as max_created, created_by
    FROM draft
    WHERE form_type IN ('${formTypes.join("','")}') AND created_by = ? AND owner_id = ?
    GROUP BY form_type, created_by
  )
  SELECT d.id, d.form_type, d.status
  FROM draft d
  JOIN LatestDrafts ld ON d.form_type = ld.form_type AND d.created_at = ld.max_created AND d.created_by = ld.created_by;`;

  return { query, bindParams: [FREELANCERId, ownerId] };
}

export function getHotelDraftsQuery(ownerId, FREELANCERId) {
  const query = `
  WITH LatestDrafts AS (
   
    SELECT form_type, MAX(created_at) as max_created, created_by
    FROM draft
    WHERE form_type IN ('RESTAURANT', 'VENUE') AND created_by= ? AND owner_id = ?
    GROUP BY form_type, created_by
  )
  (
  SELECT d.id, d.form_type, d.status
  FROM draft d
  JOIN LatestDrafts ld ON d.form_type = ld.form_type AND d.created_at = ld.max_created AND d.created_by = ld.created_by)
  
  UNION
  
 (SELECT id, form_type, status
  FROM draft 
  WHERE form_type = 'HOTEL' AND owner_id = ? AND status <> 'APPROVED'
  ORDER BY created_at DESC
  LIMIT 1)`;

  return { query, bindParams: [FREELANCERId, ownerId, ownerId] };
}
