CREATE TABLE "stocks" (
	"product_id" uuid UNIQUE,
	"count" integer,
	FOREIGN KEY ("product_id") REFERENCES "products" ("id")
);

INSERT INTO public.stocks (product_id,count) VALUES
 ('7b03593c-97a4-401a-837e-de8c4f19c428'::uuid,13),
 ('8501d388-5f15-4535-a6ab-e86ae2da4847'::uuid,9),
 ('ab41e80e-7d74-4024-8abd-057d79c292ac'::uuid,9),
 ('dc24b66e-6659-4392-9156-1ec4cd33a227'::uuid,11),
 ('80e429bd-d407-41aa-b343-21669a5812f6'::uuid,14),
 ('42634528-e1a8-4105-b3dc-51fea2191d15'::uuid,7),
 ('804c023c-623b-4ccc-a6d3-154cb69a948a'::uuid,9),
 ('ebaa820e-dba5-4a4f-820b-0f9c6317cd0f'::uuid,12),
 ('04c13f07-13d1-4185-bd5e-dcf63670496a'::uuid,8),
 ('ec9fbdfe-f655-43fe-871d-bbb42faccf3d'::uuid,6);
INSERT INTO public.stocks (product_id,count) VALUES
 ('9e12f320-07a2-4ac8-830d-203d0d0a6684'::uuid,14),
 ('0af5119c-0602-42fc-89e7-20c31ea39fb4'::uuid,9),
 ('122ed9af-61c7-4fac-ad0b-e10c2941b896'::uuid,7),
 ('1cc0b2d4-26bb-47da-ad48-39128d89fcd8'::uuid,8),
 ('01977ea3-eef4-49e7-9f80-923d2488d9a8'::uuid,5),
 ('35dd4896-8f1d-4ca4-9cd1-0723426390ae'::uuid,5),
 ('28d65d81-c846-4b92-a57d-c5602c9b6a05'::uuid,6),
 ('36bc2111-4ba7-450e-b04a-382f42ca1e74'::uuid,12),
 ('ed58d6dd-1bb1-4738-a654-23e38ef4c151'::uuid,8),
 ('c68f47ff-8d6c-4b4d-9ed8-53a1fada223d'::uuid,11);

 DROP TABLE "stocks";