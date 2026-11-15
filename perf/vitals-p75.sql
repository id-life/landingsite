-- PERF-08: 28-day p75 of LCP, INP and CLS by layout, route group and section, with sample counts, from the GA4
-- BigQuery export of the web_vital events (src/lib/analytics/vitals.ts).
-- Needs the GA4 property linked to BigQuery (an owner step); replace PROJECT.analytics_PROPERTY_ID with the export
-- dataset. Column names follow Google's export schema: https://support.google.com/analytics/answer/7029846
-- Units: milliseconds for LCP and INP, CLS x 1000. A metric instance (metric_id) can be reported more than once (CLS
-- and INP grow during the visit), so its value is the sum of its metric_delta values. page_location and section_id
-- name the landing URL of the document, not the section the visitor had moved to when the vital was reported.
WITH vitals AS (
  SELECT
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'metric_name') AS metric_name,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'metric_id') AS metric_id,
    (SELECT COALESCE(value.int_value, CAST(ROUND(COALESCE(value.double_value, value.float_value)) AS INT64))
       FROM UNNEST(event_params) WHERE key = 'metric_delta') AS metric_delta,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'layout') AS layout,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'section_id') AS section_id,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'page_location') AS page_location,
    (SELECT value.string_value FROM UNNEST(event_params) WHERE key = 'traffic_type') AS traffic_type
  FROM `PROJECT.analytics_PROPERTY_ID.events_*`
  WHERE event_name = 'web_vital'
    AND _TABLE_SUFFIX BETWEEN FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 28 DAY))
                          AND FORMAT_DATE('%Y%m%d', DATE_SUB(CURRENT_DATE(), INTERVAL 1 DAY))
),
per_instance AS (
  SELECT
    metric_name,
    metric_id,
    ANY_VALUE(layout) AS layout,
    ANY_VALUE(section_id) AS section_id,
    ANY_VALUE(page_location) AS page_location,
    SUM(metric_delta) AS value
  FROM vitals
  WHERE metric_name IN ('LCP', 'INP', 'CLS')
    AND (traffic_type IS NULL OR traffic_type != 'internal')
  GROUP BY metric_name, metric_id
)
SELECT
  layout,
  CASE
    WHEN REGEXP_CONTAINS(page_location, r'^https?://[^/]+/news') THEN 'news'
    WHEN REGEXP_CONTAINS(page_location, r'^https?://[^/]+/podcast') THEN 'podcast'
    WHEN section_id IS NOT NULL THEN 'experience'
    ELSE 'other content'
  END AS route_group,
  COALESCE(section_id, '(content page)') AS section_id,
  metric_name,
  COUNT(*) AS samples,
  APPROX_QUANTILES(value, 100)[OFFSET(75)] AS p75
FROM per_instance
GROUP BY layout, route_group, section_id, metric_name
ORDER BY layout, route_group, section_id, metric_name;
