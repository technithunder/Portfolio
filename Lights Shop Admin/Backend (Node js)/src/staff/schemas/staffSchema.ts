import { z } from 'zod';

// Define the list of nationalities
export const nationalities = [
  "Afghan", "Albanian", "Algerian", "American", "Andorran", "Angolan", "Argentine", "Armenian",
  "Australian", "Austrian", "Azerbaijani", "Bangladeshi", "Belgian", "Brazilian", "British",
  "Bulgarian", "Canadian", "Chilean", "Chinese", "Colombian", "Croatian", "Czech", "Danish",
  "Dutch", "Egyptian", "Estonian", "Finnish", "French", "Georgian", "German", "Greek", "Hungarian",
  "Icelandic", "Indian", "Indonesian", "Iranian", "Iraqi", "Irish", "Israeli", "Italian", "Japanese",
  "Jordanian", "Kazakh", "Kenyan", "Korean", "Kuwaiti", "Latvian", "Lebanese", "Lithuanian",
  "Malaysian", "Mexican", "Moroccan", "Nepalese", "New Zealander", "Nigerian", "Norwegian", "Pakistani",
  "Peruvian", "Philippine", "Polish", "Portuguese", "Qatari", "Romanian", "Russian", "Saudi", "Serbian",
  "Singaporean", "Slovak", "Slovenian", "South African", "Spanish", "Sri Lankan", "Swedish", "Swiss",
  "Syrian", "Taiwanese", "Thai", "Tunisian", "Turkish", "Ukrainian", "Emirati", "Venezuelan", "Vietnamese",
  "Yemeni"
] as const;

export const statuses = [
  "Active", "In Active"
] as const;

// Zod schema for Staff validation
const StaffSchema = z.object({
  role: z.string().optional(),
  position: z.string().optional(),
  joiningDate: z.string().optional(),  // Should be in 'YYYY-MM-DD' format
  firstName: z.string().min(1, 'First name is required'),
  lastName: z.string().min(1, 'Last name is required'),
  age: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(18, 'Age must be at least 18').optional(),
  ),
  gender: z.enum(['male', 'female']).optional(),
  dob: z.string().optional(),  // Should be in 'YYYY-MM-DD' format
  address: z.string().optional(),
  nationality: z.enum(nationalities).optional(),
  status: z.enum(statuses).optional(),
  department: z.string().optional(),
  maritalStatus: z.enum(['single', 'married']).optional(),
  degree: z.string().optional(),
  university: z.string().optional(),
  passingYear: z.string().optional(),
  percentage: z.preprocess(
    (val) => (val ? Number(val) : undefined), // Convert string to number
    z.number().min(0).max(100).optional(),
  ),
  mobileNumber: z.string().optional(),
  email: z.string().email('Invalid email address').optional(),
});


export default StaffSchema;

export const UpdateStaffSchema = StaffSchema.partial();


