/**
 * Database seed script.
 *
 * Populates PostgreSQL with the same data from mock/db.json so the app
 * works identically after the migration. Run with: npm run db:seed
 *
 * Prerequisites:
 *   1. PostgreSQL is available
 *   2. Schema is pushed:   npm run db:push
 */

import { config } from "dotenv"
import { scryptSync, randomBytes } from "node:crypto"
import { generateId } from "./ulid"

// Load .env.local BEFORE importing any modules that read process.env
config({ path: ".env.local" })

const { db } = await import("./connection")
const {
  users,
  posts,
  generalSettings,
  appearanceSettings,
  notificationsSettings,
  securitySettings,
  departments,
} = await import("./schema")
// Minimal defaults — seed only needs to record neutral light/dark vars.
const DEFAULT_LIGHT: Record<string, string> = {}
const DEFAULT_DARK: Record<string, string> = {}

// --- Password hashing (matches mock server format) ---

const SCRYPT_N = 16384
const SCRYPT_KEY_LEN = 64

function hashPassword(plain: string): string {
  const salt = randomBytes(16)
  const key = scryptSync(plain, salt, SCRYPT_KEY_LEN, { N: SCRYPT_N })
  return `scrypt$${SCRYPT_N}$${salt.toString("hex")}$${key.toString("hex")}`
}

// --- Seed data ---

const SEED_PASSWORD = "password"

// Pre-generate ULIDs for users so posts can reference them
const USER_IDS = Array.from({ length: 15 }, () => generateId())

async function seedUsers() {
  const hashed = hashPassword(SEED_PASSWORD)

  const userData = [
    {
      id: USER_IDS[0],
      firstName: "Leanne",
      middleName: "Marie",
      lastName: "Graham",
      email: "leanne@high6.test",
      contactNumber: "+1 (770) 736-8031",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[1],
      firstName: "Ervin",
      lastName: "Howell",
      email: "ervin.howell@example.com",
      contactNumber: "+1 (010) 692-6593",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[2],
      firstName: "Clementine",
      middleName: "Rose",
      lastName: "Bauch",
      email: "clementine.bauch@example.com",
      contactNumber: "+1 (463) 123-4447",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[3],
      firstName: "Patricia",
      lastName: "Lebsack",
      email: "test@gmail.com",
      contactNumber: "+1 (463) 123-4447",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[4],
      firstName: "Chelsey",
      middleName: "Anne",
      lastName: "Dietrich",
      email: "chelsey.dietrich@example.com",
      contactNumber: "+1 (254) 954-1289",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[5],
      firstName: "Dennis",
      lastName: "Schulist",
      email: "dennis.schulist@example.com",
      contactNumber: "+1 (477) 935-8478",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[6],
      firstName: "Kurtis",
      middleName: "James",
      lastName: "Weissnat",
      email: "kurtis.weissnat@example.com",
      contactNumber: "+1 (210) 067-6132",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[7],
      firstName: "Nicholas",
      lastName: "Runolfsdottir",
      email: "asdasdasd@gmail.com",
      contactNumber: "+1 (555) 010-0182",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[8],
      firstName: "Glenna",
      lastName: "Reichert",
      email: "glenna.reichert@example.com",
      contactNumber: "+1 (775) 976-6794",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[9],
      firstName: "Clementina",
      middleName: "Marie",
      lastName: "DuBuque",
      email: "clementina.dubuque@example.com",
      contactNumber: "+1 (024) 648-3804",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[10],
      firstName: "Marcus",
      middleName: "Alexander",
      lastName: "Quigley",
      email: "marcus@high6.test",
      contactNumber: "+1 (555) 010-0111",
      passwordHash: hashPassword("password1"),
    },
    {
      id: USER_IDS[11],
      firstName: "Dahlia",
      lastName: "Vega",
      email: "dahlia.vega@example.com",
      contactNumber: "+1 (555) 010-0182",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[12],
      firstName: "Sebastián",
      middleName: "Luis",
      lastName: "Ruiz",
      email: "sebastian.ruiz@example.com",
      contactNumber: "+34 (555) 010-0134",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[13],
      firstName: "Amara",
      lastName: "Okafor",
      email: "amara.okafor@example.com",
      contactNumber: "+234 (555) 010-0146",
      passwordHash: hashed,
    },
    {
      id: USER_IDS[14],
      firstName: "Yuki",
      middleName: "Hana",
      lastName: "Tanaka",
      email: "yuki.tanaka@example.jp",
      contactNumber: "+81 (555) 010-0167",
      passwordHash: hashed,
    },
  ]

  await db
    .insert(users)
    .values(userData)
    .onConflictDoNothing()
  console.log(`Seeded ${userData.length} users`)
}

async function seedPosts() {
  const postData = [
    {
      title: "sunt aut facere repellat provident occaecatic",
      body: "quia et suscipit\nsuscipit recusandae consequuntur expedita\ntest test",
      userId: USER_IDS[0],
      status: "published" as const,
    },
    {
      title: "qui est essetes",
      body: "est rerum tempore vitae sequi sint nihil",
      userId: USER_IDS[0],
      status: "published" as const,
    },
    {
      title: "ea molestias quasi exercitationem",
      body: "et iusto sed quo iure voluptatem occaecati",
      userId: USER_IDS[0],
      status: "published" as const,
    },
    {
      title: "eum et est occaecati",
      body: "ullam et saepe reiciendis voluptatem adipisci",
      userId: USER_IDS[0],
      status: "published" as const,
    },
    {
      title: "nesciunt quas odio",
      body: "repudiandae veniam quaerat sunt sed",
      userId: USER_IDS[0],
      status: "published" as const,
    },
    {
      title: "dolorem eum magni eos aperiam quia",
      body: "ut aspernatur corporis harum nihil quis provident sequi",
      userId: USER_IDS[1],
      status: "published" as const,
    },
    {
      title: "magnam facilis autem",
      body: "dolore placeat quibusdam ea quo vitae magni quis enim",
      userId: USER_IDS[1],
      status: "published" as const,
    },
    {
      title: "dolorem dolore est ipsam",
      body: "dignissimos aperiam dolorem qui eum facilis quibusdam",
      userId: USER_IDS[1],
      status: "published" as const,
    },
    {
      title: "nesciunt iure omnis dolorem tempora",
      body: "consectetur animi nesciunt iure doloreses",
      userId: USER_IDS[1],
      status: "published" as const,
    },
    {
      title: "optio molestias id quia eum",
      body: "quo et expedita modi cum officia vel magni doloribus",
      userId: USER_IDS[1],
      status: "published" as const,
    },
    {
      title: "et ea vero quia laudantium autem",
      body: "delectus reiciendis molestiae occaecati non minima eveniet",
      userId: USER_IDS[2],
      status: "published" as const,
    },
    {
      title: "in quibusdam tempore odit est dolorem",
      body: "itaque id aut magnam praesentium quia et ea",
      userId: USER_IDS[2],
      status: "published" as const,
    },
    {
      title: "dolorum ut in voluptas mollitia et enim",
      body: "aut dicta possimus sint mollitia voluptas commodi quo",
      userId: USER_IDS[2],
      status: "published" as const,
    },
    {
      title: "voluptatem eligendi optio",
      body: "fuga et accusamus dolorum perferendis illo voluptas",
      userId: USER_IDS[2],
      status: "published" as const,
    },
    {
      title: "eveniet quod temporibus",
      body: "reprehenderit quos placeat velit minima officia dolores",
      userId: USER_IDS[2],
      status: "published" as const,
    },
    {
      title: "sint suscipit perspiciatis velit dolorum",
      body: "eos voluptatibus quaerat neque indicia",
      userId: USER_IDS[3],
      status: "published" as const,
    },
    {
      title: "fugit voluptas sed molestias voluptatem provident",
      body: "eos voluptas et aut odit natus earum",
      userId: USER_IDS[3],
      status: "published" as const,
    },
    {
      title: "voluptate et itaque vero tempora molestiae",
      body: "eveniet quo quis laborum totam consequatur",
      userId: USER_IDS[3],
      status: "published" as const,
    },
    {
      title: "adipisci placeat illum aut reiciendis qui",
      body: "illum quis cupiditate provident sit magnam",
      userId: USER_IDS[3],
      status: "published" as const,
    },
    {
      title: "doloribus ad provident suscipit at",
      body: "qui consequuntur ducimus possimus quisquam amet similique",
      userId: USER_IDS[3],
      status: "published" as const,
    },
    {
      title: "asperiores ea ipsam voluptatibus modi",
      body: "dignissimos non error recusandae voluptates rem",
      userId: USER_IDS[4],
      status: "published" as const,
    },
    {
      title: "dolor sint quo a velit explicabo",
      body: "facere aut qui quas",
      userId: USER_IDS[4],
      status: "published" as const,
    },
    {
      title: "maxime id vitae nihil numquam",
      body: "veritatis unde neque eligendi",
      userId: USER_IDS[4],
      status: "published" as const,
    },
    {
      title: "autem hic labore sunt dolores incidunt",
      body: "enim et ex nulla omnis voluptas quia qui",
      userId: USER_IDS[4],
      status: "published" as const,
    },
    {
      title: "rem alias distinctio quo quis",
      body: "ullam consequatur ut omnis quis sit vel consequuntur",
      userId: USER_IDS[4],
      status: "published" as const,
    },
    {
      title: "est et quae odit qui non",
      body: "similique esse doloribus nihil accusamus",
      userId: USER_IDS[5],
      status: "published" as const,
    },
    {
      title: "quasi id et eos tenetur aut suscipit hic",
      body: "tempora libero voluptas ab dignissimos",
      userId: USER_IDS[5],
      status: "published" as const,
    },
    {
      title: "delectus ullam et corporis nulla voluptas sequi",
      body: "non et quaerat ex quae ad maiores",
      userId: USER_IDS[5],
      status: "published" as const,
    },
    {
      title: "iusto eius quod necessitatibus culpa ea",
      body: "odit magnam ut saepe sed non qui tempora atque",
      userId: USER_IDS[5],
      status: "published" as const,
    },
    {
      title: "a quo magni similique perferendis",
      body: "alias dolor cumque eum inventore facere",
      userId: USER_IDS[5],
      status: "published" as const,
    },
    {
      title: "ullam ut quidem id aut vel consequuntur",
      body: "debitis eius sed quibusdam non quis consectetur",
      userId: USER_IDS[6],
      status: "published" as const,
    },
    {
      title: "doloremque illum aliquid sunt",
      body: "deserunt eos nobis asperiores et hic",
      userId: USER_IDS[6],
      status: "published" as const,
    },
    {
      title: "qui explicabo molestiae dolorem",
      body: "rerum ut et numquam laborum odit est sit",
      userId: USER_IDS[6],
      status: "published" as const,
    },
    {
      title: "magnam ut rerum iure",
      body: "ea velit perferendis earum ut voluptatum",
      userId: USER_IDS[6],
      status: "published" as const,
    },
    {
      title: "id nihil consequatur molestias animi provident",
      body: "nisi error delectus possimus ut eligendi vitae",
      userId: USER_IDS[6],
      status: "published" as const,
    },
    {
      title: "fuga nam accusamus voluptas reiciendis itaque",
      body: "ad mollitia et omnis minus architecto odit",
      userId: USER_IDS[7],
      status: "published" as const,
    },
    {
      title: "provident vel ut sit ratione est",
      body: "debitis et eaque non officia sed nesciunt",
      userId: USER_IDS[7],
      status: "published" as const,
    },
    {
      title: "explicabo et eos deleniti nostrum ab id",
      body: "amet et quis aliquid distinctio",
      userId: USER_IDS[7],
      status: "published" as const,
    },
    {
      title: "eos dolorem iste accusantium est eaque quam",
      body: "corporis rerum ducimus vel eum accusantium",
      userId: USER_IDS[7],
      status: "published" as const,
    },
    {
      title: "enim quo cumque",
      body: "ut voluptatum aliquid illo tenetur nemo",
      userId: USER_IDS[7],
      status: "published" as const,
    },
    {
      title: "non est facere",
      body: "molestias id nostrum excepturi molestiae",
      userId: USER_IDS[8],
      status: "published" as const,
    },
    {
      title: "commodi ullam sint et excepturi",
      body: "unde sequi ullam ea odit sit",
      userId: USER_IDS[8],
      status: "published" as const,
    },
    {
      title: "ad iusto omnis odit dolor voluptatibus",
      body: "minus harum shatever quos expedita nobis",
      userId: USER_IDS[8],
      status: "published" as const,
    },
    {
      title: "optio dolor molestias sit",
      body: "temporibus est consectetur dolore",
      userId: USER_IDS[8],
      status: "published" as const,
    },
    {
      title: "ut numquam possimus omnis eius suscipit",
      body: "est autem sed sit consectetur dolor",
      userId: USER_IDS[8],
      status: "published" as const,
    },
    {
      title: "aut quo modi neque nostrum ducimus",
      body: "voluptatem quisquam iste",
      userId: USER_IDS[9],
      status: "published" as const,
    },
    {
      title: "quibusdam cumque rem aut deserunt",
      body: "voluptatem assumenda ut qui ut cupiditate",
      userId: USER_IDS[9],
      status: "published" as const,
    },
    {
      title: "ut voluptatem illum ea doloribus itaque eos",
      body: "voluptates quo voluptatem porro id",
      userId: USER_IDS[9],
      status: "published" as const,
    },
    {
      title: "laborum non sunt aut ut assumenda perspiciatis voluptas",
      body: "inventore ab sint natus fugit id nulla",
      userId: USER_IDS[9],
      status: "published" as const,
    },
    {
      title: "repellendus qui recusandae incidunt voluptates tenetur",
      body: "error suscipit maxime adipisci consequuntur recusandae",
      userId: USER_IDS[9],
      status: "published" as const,
    },
    {
      title: "incidunt cupiditate deserunt ut qui",
      body: "id molestias dolor minus",
      userId: USER_IDS[10],
      status: "draft" as const,
    },
    {
      title: "consectetur dolor dignissimos quaerat culpa",
      body: "quos sit vel fuga debitis",
      userId: USER_IDS[10],
      status: "draft" as const,
    },
    {
      title: "nam nostrum rerum",
      body: "consectetur adipiscing elit sed do",
      userId: USER_IDS[10],
      status: "draft" as const,
    },
    {
      title: "sit asperiores ipsam eveniet odio non quia",
      body: "totam corporis dignissimos non",
      userId: USER_IDS[11],
      status: "draft" as const,
    },
    {
      title: "voluptatem libero consectetur rerum",
      body: "perspiciatis unde omnis iste natus",
      userId: USER_IDS[11],
      status: "draft" as const,
    },
    {
      title: "sint nam sollicitudin",
      body: "aspernatur aut odit aut fugit",
      userId: USER_IDS[11],
      status: "draft" as const,
    },
    {
      title: "molestias rerum et sit",
      body: "ut enim ad minim veniam quis nostrud",
      userId: USER_IDS[12],
      status: "draft" as const,
    },
    {
      title: "quam cumque aliquid eos quis",
      body: "duis aute irure dolor in reprehenderit",
      userId: USER_IDS[12],
      status: "draft" as const,
    },
    {
      title: "architecto beatae vitae dicta sunt explicabo",
      body: "nemo enim ipsam voluptatem quia voluptas",
      userId: USER_IDS[12],
      status: "draft" as const,
    },
    {
      title: "ut labore et dolore magna aliqua",
      body: "quis ipsum suspendisse ultrices gravida",
      userId: USER_IDS[13],
      status: "draft" as const,
    },
    {
      title: "mollit anim id est laborum",
      body: "excepteur sint occaecat cupidatat non proidents",
      userId: USER_IDS[13],
      status: "draft" as const,
    },
    {
      title: "at vero eos et accusamus",
      body: "et iusto odio dignissimos ducimus",
      userId: USER_IDS[13],
      status: "draft" as const,
    },
    {
      title: "temporibus autem quibusdam",
      body: "officiis debitis aut rerum necessitatibus",
      userId: USER_IDS[14],
      status: "draft" as const,
    },
    {
      title: "nam libero tempore cum soluta",
      body: "nobis est eligendi optio cumque nihil",
      userId: USER_IDS[0],
      status: "draft" as const,
    },
    {
      title: "itaque earum rerum hic tenetur",
      body: "ut aut reiciendis voluptatibus maiores",
      userId: USER_IDS[14],
      status: "draft" as const,
    },
  ]

  await db
    .insert(posts)
    .values(postData)
    .onConflictDoNothing()
  console.log(`Seeded ${postData.length} posts`)
}


async function seedDepartments() {
  const departmentData = [
    { name: "Management", description: "Leadership and operations" },
    { name: "Development", description: "Frontend, backend, and integrations" },
    { name: "QA", description: "Quality assurance and release checks" },
  ]

  await db
    .insert(departments)
    .values(departmentData)
    .onConflictDoNothing()
  console.log(`Seeded ${departmentData.length} departments`)
}

async function seedSettings() {
  // General settings
  await db
    .insert(generalSettings)
    .values({
      id: generateId(),
      appName: "High6 Corp.",
      appLogo: null,
      appIcon: null,
      appUrl: "https://high6.com",
    })
    .onConflictDoNothing()

  // Appearance settings — store only non-font/non-shadow variables in JSON
  const lightVars: Record<string, string> = {}
  const darkVars: Record<string, string> = {}
  for (const [key, value] of Object.entries(DEFAULT_LIGHT)) {
    if (
      key.startsWith("--") &&
      !key.startsWith("--font-") &&
      !key.startsWith("--shadow") &&
      !key.startsWith("--radius") &&
      key !== "--spacing" &&
      key !== "--tracking-normal"
    ) {
      lightVars[key] = value
    }
  }
  for (const [key, value] of Object.entries(DEFAULT_DARK)) {
    if (
      key.startsWith("--") &&
      !key.startsWith("--font-") &&
      !key.startsWith("--shadow") &&
      !key.startsWith("--radius") &&
      key !== "--spacing" &&
      key !== "--tracking-normal"
    ) {
      darkVars[key] = value
    }
  }

  await db
    .insert(appearanceSettings)
    .values({
      id: generateId(),
      colorTheme: "default",
      customColor: "#1e88e5",
      radius: "0.45rem",
      light: lightVars,
      dark: darkVars,
    })
    .onConflictDoNothing()

  // Notifications settings
  await db
    .insert(notificationsSettings)
    .values({
      id: generateId(),
      emailNotifications: true,
      pushNotifications: false,
      weeklyDigest: true,
    })
    .onConflictDoNothing()

  // Security settings
  await db
    .insert(securitySettings)
    .values({
      id: generateId(),
      passwordUpdatedAt: null,
    })
    .onConflictDoNothing()

  console.log("Seeded all settings")
}

async function main() {
  console.log("Seeding database...")
  await seedUsers()
  await seedPosts()
  await seedDepartments()
  await seedSettings()
  console.log("Done!")
  process.exit(0)
}

main().catch((err) => {
  console.error("Seed failed:", err)
  process.exit(1)
})
