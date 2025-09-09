import { z } from "zod";

// Define the list of nationalities
export const nationalities = [
  "Afghan",
  "Albanian",
  "Algerian",
  "American",
  "Andorran",
  "Angolan",
  "Argentine",
  "Armenian",
  "Australian",
  "Austrian",
  "Azerbaijani",
  "Bangladeshi",
  "Belgian",
  "Brazilian",
  "British",
  "Bulgarian",
  "Canadian",
  "Chilean",
  "Chinese",
  "Colombian",
  "Croatian",
  "Czech",
  "Danish",
  "Dutch",
  "Egyptian",
  "Estonian",
  "Finnish",
  "French",
  "Georgian",
  "German",
  "Greek",
  "Hungarian",
  "Icelandic",
  "Indian",
  "Indonesian",
  "Iranian",
  "Iraqi",
  "Irish",
  "Israeli",
  "Italian",
  "Japanese",
  "Jordanian",
  "Kazakh",
  "Kenyan",
  "Korean",
  "Kuwaiti",
  "Latvian",
  "Lebanese",
  "Lithuanian",
  "Malaysian",
  "Mexican",
  "Moroccan",
  "Nepalese",
  "New Zealander",
  "Nigerian",
  "Norwegian",
  "Pakistani",
  "Peruvian",
  "Philippine",
  "Polish",
  "Portuguese",
  "Qatari",
  "Romanian",
  "Russian",
  "Saudi",
  "Serbian",
  "Singaporean",
  "Slovak",
  "Slovenian",
  "South African",
  "Spanish",
  "Sri Lankan",
  "Swedish",
  "Swiss",
  "Syrian",
  "Taiwanese",
  "Thai",
  "Tunisian",
  "Turkish",
  "Ukrainian",
  "Emirati",
  "Venezuelan",
  "Vietnamese",
  "Yemeni",
] as const;

export const statuses = ["Active", "In Active", "Blocked"] as const;
const qualificationSchema = z.array(
  z
    .object({
      id: z.string().optional(),
      degree: z.string(),
      university: z.string(),
      passingYear: z.string(),
      percentage: z.string(),
    })
    .strict() // Disallow extra keys
);

// Zod schema for Staff validation
const UserSchema = z.object({
  role: z.enum(["staff", "dealer", "customer"]).optional(),
  // position: z.string().optional(),
  joiningDate: z.string().optional(), // Should be in 'YYYY-MM-DD' format
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  age: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(18, "Age must be at least 18").optional()
  ),
  gender: z.enum(["male", "female"]).optional(),
  dob: z.string().optional(), // Should be in 'YYYY-MM-DD' format
  // address: z.string().optional(),
  nationality: z.enum(nationalities).optional(),
  status: z.enum(statuses).optional(),
  // department: z.string().optional(),
  maritalStatus: z.enum(["single", "married"]).optional(),
  mobileNumber: z.string().optional(),
  // earning: z.string().optional(),
  email: z.string().email("Invalid email address"), // Not optional
  // qualification: qualificationSchema.optional(),
  panCardNumber: z.string().nullable().optional(),
  bankName: z.string().nullable().optional(),
  accountNumber: z.string().nullable().optional(),
  bankBranchName: z.string().nullable().optional(),
  ifscCode: z.string().nullable().optional(),
  gstNumber: z.string().nullable().optional(),
  companyName: z.string().nullable().optional(),
});

export default UserSchema;

export const userCreate = z.object({
  role: z.enum(["staff", "dealer", "customer"]).optional(),
  email: z.string().email("Invalid email address"),
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
});

export const UpdateUserSchema = UserSchema.partial().extend({
  email: z.string().email("Invalid email address"),
});
