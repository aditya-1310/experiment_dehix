import { z } from "zod";

const amenitieskeyEnum = z.enum(["EQUIPMENTS", "FACILITIES"]);
const videoUplodeTypeEnum = z.enum(["MANUAL", "DIRECT_LINK"]);
const pricingTypeEnum = z.enum([
  "VENUE_RENTAL",
  "MIN_SPEND_PER_PERSON",
  "MIN_SPEND_PRICINGS",
  "ACCOMMODATION",
]);
const pricingDurationEnum = z.enum([
  "PER_HOUR",
  "PER_SESSION",
  "PER_MORNING",
  "PER_AFTERNOON",
  "PER_EVENING",
  "PER_DAY",
]);
const pricingDaysEnum = z.enum([
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
  "SATURDAY",
  "SUNDAY",
]);

const basicDetailsSchema = z
  .object({
    name: z.string().nonempty(),
    parent_name: z.string().nonempty(),
    description: z.string().nonempty(),
  })
  .strict();

const additionalDetailsSchema = z
  .object({
    view_type: z.array(z.string().nonempty()),
    venue_setting_type: z.array(z.string().nonempty()),
    venue_style: z
      .object({
        traditional_style: z.array(z.string().nonempty()),
        modern_style: z.array(z.string().nonempty()),
        eclectic_style: z.array(z.string().nonempty()),
        cultural_regional_style: z.array(z.string().nonempty()),
      })
      .strict(),
    venue_hire_type: z.string().nonempty(),
  })
  .strict();

const venueTypeSchema = z
  .object({
    venue_type: z.array(z.string().nonempty()),
    venue_display_type: z.string().nonempty(),
  })
  .strict();

const businessEventTypeSchema = z.object({
  conference_seminar: z.array(z.string()),
  corporate_event: z.array(z.string()),
});

const weddingEventTypeSchema = z.object({
  wedding: z.array(z.string()),
  dining: z.array(z.string()),
  banquet: z.array(z.string()),
});

const partiesEventTypeSchema = z.object({
  social_parties: z.array(z.string()),
  clubbing_nightout: z.array(z.string()),
  drinks_receptions: z.array(z.string()),
  christmas_parties: z.array(z.string()),
  baby_shower_tea_parties: z.array(z.string()),
  childreen_teen: z.array(z.string()),
  genetic_tags: z.array(z.string()),
});

const artAndCulturalEventTypeSchema = z.object({
  filming_and_photography: z.array(z.string()),
  cultural: z.array(z.string()),
  art_spaces: z.array(z.string()),
  performance_exhibitions: z.array(z.string()),
});

const eventTypeSchema = z
  .object({
    business: businessEventTypeSchema,
    wedding_dining: weddingEventTypeSchema,
    parties: partiesEventTypeSchema,
    art_and_cultural: artAndCulturalEventTypeSchema,
    kids: z.array(z.string()),
  })
  .strict();

const locationSchema = z
  .object({
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
  })
  .strict();

const overviewSchema = z
  .object({
    basic_details: basicDetailsSchema,
    additional_details: additionalDetailsSchema,
    venue_type: venueTypeSchema,
    event_type: eventTypeSchema,
    location: locationSchema,
  })
  .strict();

const capacitySchema = z
  .object({
    venue_size: z.string().nonempty(),
    venue_size_unit: z.string().nonempty(),
    standing_capacity: z.number().nonnegative().nullable(),
    has_standing_capacity: z.boolean().nullable(),
    sitting_capacity: z.number().nonnegative().nullable(),
    dining_capacity: z.number().nonnegative().nullable(),
    has_dining_capacity: z.boolean().nullable(),
    theatre_capacity: z.number().nonnegative().nullable(),
    has_theatre_capacity: z.boolean().nullable(),
    boardroom_capacity: z.number().nonnegative().nullable(),
    has_boardroom_capacity: z.boolean().nullable(),
    has_u_shaped_capacity: z.boolean().nullable(),
    u_shaped_capacity: z.number().nonnegative().nullable(),
    has_cabaret_capacity: z.boolean().nullable(),
    cabaret_capacity: z.number().nonnegative().nullable(),
  })
  .strict();

const offersAndPackageSchema = z.array(
  z
    .object({
      venue_offer_id: z.string().nonempty().nullable(),
      title: z.string().nonempty("Title is required"),
      offer_start_date: z.string().nonempty("Offer start date is required"),
      offer_end_date: z.string().nonempty("Offer end date is required"),
      description: z.string().nonempty("Description is required"),
    })
    .strict(),
);

const cateringAndDrinksSchema = z
  .object({
    has_inhouse_catering: z.boolean(),
    menu_type: z.array(z.string()),
    cuisine_type: z.array(z.string()),
    has_external_catering: z.boolean(),
    has_alcohol_license: z.boolean(),
    alcohol_license_duration: z.array(z.string()),
    is_corkage_fee_on_byob: z.boolean(),
    is_byob_allowed: z.boolean(),
    has_refreshments: z.boolean(),
    refreshments_type: z.array(z.string()),
    has_shisha: z.boolean(),
    serving_style: z.array(z.string()),
  })
  .strict();

const spaceRuleSchema = z
  .object({
    policy_start_age: z.number().nonnegative().nullable(),
    policy_end_age: z.number().nonnegative().nullable(),
    space_rule: z.string().nonempty().nullable(),
    is_ticketed_events_allowed: z.boolean(),
  })
  .strict();

const amenitiesSchema = z
  .object({
    key: amenitieskeyEnum.nullable(),
    data: z
      .array(
        z.object({
          amenity_id: z.string().nonempty().nullable(),
          venue_amenity_id: z.string().nonempty().nullable(),
          icon: z.string(),
          amenity_name: z.string().nonempty("Amenity name is required"),
          is_selected: z.boolean(),
        }),
      )
      .nonempty("At least one amenity must be provided"),
  })
  .strict();

const facilitiesAndEquipmentsSchema = z
  .object({
    equipments: amenitiesSchema,
    facilities: amenitiesSchema,
  })
  .strict();

const audioSchema = z
  .object({
    is_indoor_music_allowed: z.boolean(),
    indoor_music_timing: z.string(),
    is_outdoor_music_allowed: z.boolean(),
    outdoor_music_timing: z.string(),
    pa_system_speaker: z.boolean(),
    can_play_own_music: z.boolean(),
    bring_own_dj_allowed: z.boolean(),
    has_space_noise_restrictions: z.boolean(),
  })
  .strict();

const photosAndVideosSchema = z
  .object({
    images: z
      .array(z.string().nonempty())
      .nonempty("At least one image is required"),
    videos: z
      .array(z.string().nonempty())
      .nonempty("At least one video is required"),
    video_upload_type: z
      .string(videoUplodeTypeEnum)
      .nonempty("Video Upload type"),
  })
  .strict();

const uploadDocumentsSchema = z.object({
  floor_plans: z
    .array(z.string().nonempty())
    .nonempty("At least one image is required"),
  trade_licenses: z
    .array(z.string().nonempty())
    .nonempty("At least one image is required"),
  sample_menus: z
    .array(z.string().nonempty())
    .nonempty("At least one image is required"),
});

const pricingSchema = z.array(
  z
    .object({
      venue_price_id: z.string(),
      price: z.number().nonnegative(),
      pricing_type: pricingTypeEnum,
      duration: pricingDurationEnum,
      start_time: z.string(),
      end_time: z.string(),
      days: z.array(pricingDaysEnum),
      is_selected_to_display: z.boolean(),
    })
    .strict(),
);

// mainSchema
export const venueDraftSchema = z
  .object({
    overview: overviewSchema,
    capacity: capacitySchema,
    pricing: pricingSchema,
    offers_and_package: offersAndPackageSchema,
    catering_and_drinks: cateringAndDrinksSchema,
    space_rule: spaceRuleSchema,
    facilities_and_equipments: facilitiesAndEquipmentsSchema,
    audio: audioSchema,
    upload_documents: uploadDocumentsSchema,
    photos_and_videos: photosAndVideosSchema,
  })
  .strict();
