import { z } from "zod";

// Basic Details Schema
export const basicDetailsSchema = z.object({
  name: z.string().nonempty("Hotel name is required"),
  description: z.string().nonempty("Hotel description is required"),
  website: z.string().nonempty("Hotel website is required"),
  rating: z.string().nonempty("Hotel rating is required"),
  chain: z.string().nullable(),
  brand: z.string().nullable(),
  type: z.array(z.string()),
  view_type: z.array(z.string()),
  traditional_style: z.array(z.string()),
  modern_style: z.array(z.string()),
  eclectic_style: z.array(z.string()),
  cultural_regional_style: z.array(z.string()),
});
//.strict();

// Additional Details Schema
export const additionalDetailsSchema = z.object({
  is_hotel_sustainable: z.boolean(),
  built_year: z.string().nonempty("Hotel built year is required"),
  last_renovated_on: z.string().nullable().optional(),
  event_types: z
    .array(z.string())
    .nonempty("At least one event type is required"),
  awards: z
    .array(
      z.object({
        name: z.string().nonempty("Award name is required"),
        year: z.string().nonempty("Award year is required"),
      }),
    )
    .optional(),
  trade_licenses: z
    .array(z.string())
    .nonempty("Trade license link is required"),
});
//.strict();

// Location Schema
export const locationSchema = z.object({
  address_line1: z.string().nonempty("Address line 1 is required"),
  address_line2: z.string().optional(),
  city: z.string().nonempty("City is required"),
  state: z.string().nonempty("Area is required"),
  pincode: z.string().nonempty("PO Box is required"),
  country: z.string().nonempty("Country is required"),
  location_lat: z.string().optional(),
  location_long: z.string().optional(),
  map_link: z.string().optional(),
  accessibility_features: z
    .array(z.string())
    .nonempty("At least one accessibility feature is required"),
  parking_available: z.boolean(),
  valet_parking: z.boolean(),
});
//.strict();

// Accommodation Schema
export const accommodationSchema = z.object({
  count: z.number().nonnegative("Price must be a non-negative number"),
});
//.strict();

const amenitieskeyEnum = z.enum(["RECREATIONAL", "ROOM", "BUSINESS"]);

export const amenitiesItemSchema = z.object({
  key: z.string(amenitieskeyEnum).nonempty("Category type is required"),
  data: z
    .array(
      z.object({
        amenity_id: z.string().nullable(),
        venue_amenity_id: z.string().nullable(),
        icon: z.string(),
        amenity_name: z.string().nonempty("Amenity name is required"),
        is_selected: z.boolean(),
      }),
    )
    .nonempty("At least one amenity must be provided"),
});
//.strict();

// Amenities Schema
export const amenitiesSchema = z.object({
  room: amenitiesItemSchema,
  business: amenitiesItemSchema,
  recreational: amenitiesItemSchema,
});
//.strict();

const pricingTypes = z.enum([
  "VENUE_RENTAL",
  "MIN_SPEND_PER_PERSON",
  "MIN_SPEND_PRICINGS",
  "ACCOMMODATION",
]);

export const pricingSchema = z.object({
  venue_price_id: z.string().nullable(),
  price: z.number().nonnegative("Price must be a non-negative number"),
  accommodation_seasonality: z.object({
    high_demand: z.array(z.string()),
    mid_demand: z.array(z.string()),
    low_demand: z.array(z.string()),
  }),
  pricing_type: z.string(pricingTypes),
});
//.strict();

export const offersSchema = z
  .array(
    z.object({
      venue_offer_id: z.string().nullable(),
      title: z.string().nonempty("Title is required"),
      offer_start_date: z.string().nonempty("Offer start date is required"),
      offer_end_date: z.string().nonempty("Offer end date is required"),
      description: z.string().nonempty("Description is required"),
    }),
    //.strict(),
  )
  .nonempty();

const videoUplodeTypeEnum = z.enum(["MANUAL", "DIRECT_LINK"]);
// Photos and Videos Schema
export const photosAndVideosSchema = z.object({
  images: z.array(z.string()).nonempty("At least one image is required"),
  videos: z.array(z.string()).nonempty("At least one video is required"),
  video_upload_type: z
    .string(videoUplodeTypeEnum)
    .nonempty("Video Uplode type"),
});
//.strict();

// Overview Schema
export const overviewSchema = z.object({
  basic_details: basicDetailsSchema,
  additional_details: additionalDetailsSchema,
  location: locationSchema,
});
//.strict();

// Main Schema
export const hotelDraftSchema = z.object({
  overview: overviewSchema,
  accommodation: accommodationSchema,
  pricing: pricingSchema, // Assuming pricing can be any object and is optional
  offers_and_package: offersSchema,
  amenities: amenitiesSchema,
  photos_and_videos: photosAndVideosSchema,
});
//.strict();
