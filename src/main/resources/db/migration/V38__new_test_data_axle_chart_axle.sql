--AXLE CHART
INSERT INTO sillari.axle_chart
    (permit_id)
SELECT p.id
FROM sillari.permit p
WHERE permit_number = 'MV/176/2021';

INSERT INTO sillari.axle_chart
    (permit_id)
SELECT p.id
FROM sillari.permit p
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.axle_chart
    (permit_id)
SELECT p.id
FROM sillari.permit p
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle_chart
    (permit_id)
SELECT p.id
FROM sillari.permit p
WHERE permit_number = '150/2021';

--AXLE
INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 1, 8, 4.5
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/176/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 2, 8.75, 1.5
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/176/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 3, 8.75, 0
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/176/2021';


INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 1, 10, 3.5
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 2, 13, 1.3
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 3, 14, 9
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 4, 14, 1.3
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/177/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 5, 11, 0
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = 'MV/177/2021';


INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 1, 10, 2
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 2, 10, 2
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 3, 10, 4.1
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 4, 11, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 5, 11, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 6, 11, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 7, 11, 0
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '149/2021';


INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 1, 10, 2.85
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 2, 13, 1.45
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 3, 14, 1.37
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 4, 14, 2.93
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 5, 11, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 6, 11, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
(axle_chart_id, axle_number, weight, distance_to_next, max_distance_to_next)
SELECT ac.id, 7, 11.5, 13, 13.5
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 8, 11.5, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 9, 11.5, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 10, 11.5, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 11, 11.5, 1.36
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';

INSERT INTO sillari.axle
    (axle_chart_id, axle_number, weight, distance_to_next)
SELECT ac.id, 12, 11.5, 0
FROM sillari.axle_chart ac
         LEFT JOIN sillari.permit p ON p.id = ac.permit_id
WHERE permit_number = '150/2021';
