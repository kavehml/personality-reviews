import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

const COHORTS = [
  { name: "Explorer", description: "Loves trying new things and adventurous dining" },
  { name: "Planner", description: "Values structure, reservations, and predictable quality" },
  { name: "Foodie", description: "Prioritizes cuisine quality and culinary experiences" },
  { name: "Value-Seeker", description: "Focuses on bang-for-buck and practicality" },
  { name: "Minimalist", description: "Prefers simple, authentic, no-fuss experiences" },
];

const RESTAURANTS = [
  { name: "Le Mousso", city: "Montreal", cuisine: "French", description: "Contemporary French-Canadian tasting menu with creative presentations." },
  { name: "Joe Beef", city: "Montreal", cuisine: "French-Canadian", description: "Beloved Montreal institution known for hearty portions and seasonal fare." },
  { name: "Schwartz's", city: "Montreal", cuisine: "Deli", description: "Legendary smoked meat sandwiches since 1928." },
  { name: "Alo", city: "Toronto", cuisine: "French", description: "Fine dining with exceptional tasting menus and impeccable service." },
  { name: "St. Lawrence Market", city: "Toronto", cuisine: "Variety", description: "Historic market with diverse food vendors and fresh produce." },
  { name: "Pai Northern Thai Kitchen", city: "Toronto", cuisine: "Thai", description: "Authentic northern Thai cuisine in a vibrant setting." },
  { name: "Au Pied de Cochon", city: "Montreal", cuisine: "Quebecois", description: "Hearty Quebecois comfort food and foie gras specialties." },
  { name: "Bar Isabel", city: "Toronto", cuisine: "Spanish", description: "Spanish tapas and wood-fired dishes in a cozy space." },
  { name: "Damas", city: "Montreal", cuisine: "Syrian", description: "Upscale Syrian cuisine with shared plates and warm hospitality." },
  { name: "Canis", city: "Toronto", cuisine: "Canadian", description: "Modern Canadian cooking with a focus on local ingredients." },
];

async function main() {
  console.log("Seeding database...");

  const cohorts = await Promise.all(
    COHORTS.map((c) =>
      prisma.cohort.upsert({
        where: { name: c.name },
        update: {},
        create: c,
      })
    )
  );

  const cohortMap = Object.fromEntries(cohorts.map((c) => [c.name, c.id]));

  const restaurants = await Promise.all(
    RESTAURANTS.map((r) =>
      prisma.restaurant.upsert({
        where: { id: r.name + r.city },
        update: {},
        create: {
          id: r.name.toLowerCase().replace(/\s+/g, "-") + "-" + r.city.toLowerCase(),
          ...r,
        },
      }).catch(() =>
        prisma.restaurant.create({ data: r })
      )
    )
  );

  // Create seed users (one per cohort) and reviews
  const passwordHash = await bcrypt.hash("password123", 12);
  const seedUsers = [
    { email: "explorer@test.com", name: "Alex Explorer", cohortName: "Explorer" },
    { email: "planner@test.com", name: "Pat Planner", cohortName: "Planner" },
    { email: "foodie@test.com", name: "Fran Foodie", cohortName: "Foodie" },
    { email: "value@test.com", name: "Val Value", cohortName: "Value-Seeker" },
    { email: "minimal@test.com", name: "Mo Minimal", cohortName: "Minimalist" },
  ];

  for (const u of seedUsers) {
    await prisma.user.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email,
        name: u.name,
        passwordHash,
        cohortId: cohortMap[u.cohortName],
        quizCompleted: true,
        interests: JSON.stringify(["service", "value", "ambience"]),
      },
    });
  }

  const users = await prisma.user.findMany({
    where: { email: { in: seedUsers.map((u) => u.email) } },
  });

  const sampleReviews: Array<{
    restaurantIdx: number;
    authorEmail: string;
    rating: number;
    title: string;
    content: string;
    tags: string[];
  }> = [
    { restaurantIdx: 0, authorEmail: "explorer@test.com", rating: 5, title: "Unexpected and delightful", content: "Each course surprised me. The creativity here is unmatched.", tags: ["adventurous"] },
    { restaurantIdx: 0, authorEmail: "foodie@test.com", rating: 5, title: "Culinary excellence", content: "The technique and flavor combinations were exceptional.", tags: ["service", "ambience"] },
    { restaurantIdx: 1, authorEmail: "planner@test.com", rating: 5, title: "Worth the reservation", content: "Booked 3 weeks ahead. Everything ran smoothly and met expectations.", tags: ["service"] },
    { restaurantIdx: 1, authorEmail: "value@test.com", rating: 4, title: "Big portions", content: "You get a lot for the price. Hearty and satisfying.", tags: ["value"] },
    { restaurantIdx: 2, authorEmail: "minimal@test.com", rating: 5, title: "No frills, just greatness", content: "Simple smoked meat. Nothing fancy. Perfect.", tags: [] },
    { restaurantIdx: 2, authorEmail: "explorer@test.com", rating: 4, title: "Classic Montreal", content: "A must-try experience. The line is part of it.", tags: ["adventurous"] },
    { restaurantIdx: 3, authorEmail: "foodie@test.com", rating: 5, title: "Best tasting menu in TO", content: "Every course was perfectly executed.", tags: ["service", "ambience"] },
    { restaurantIdx: 3, authorEmail: "planner@test.com", rating: 5, title: "Impeccable service", content: "Reservations are essential. The team delivers consistently.", tags: ["service"] },
    { restaurantIdx: 4, authorEmail: "value@test.com", rating: 5, title: "So many options", content: "Great variety at reasonable prices. Love the market vibe.", tags: ["value"] },
    { restaurantIdx: 4, authorEmail: "minimal@test.com", rating: 4, title: "Honest food", content: "Fresh ingredients, no pretension. My kind of place.", tags: [] },
    { restaurantIdx: 5, authorEmail: "explorer@test.com", rating: 5, title: "Authentic Thai", content: "Real northern Thai flavors. Not the usual pad thai.", tags: ["adventurous", "healthy"] },
    { restaurantIdx: 5, authorEmail: "foodie@test.com", rating: 5, title: "Heat and depth", content: "The spice levels and complexity are outstanding.", tags: ["service"] },
    { restaurantIdx: 6, authorEmail: "value@test.com", rating: 4, title: "Hearty Quebecois", content: "Portions are huge. Come hungry.", tags: ["value"] },
    { restaurantIdx: 6, authorEmail: "planner@test.com", rating: 5, title: "Book ahead", content: "Popular spot. Plan your reservation.", tags: ["service"] },
    { restaurantIdx: 7, authorEmail: "explorer@test.com", rating: 5, title: "Tapas paradise", content: "So many options. Great for sharing and exploring.", tags: ["ambience", "adventurous"] },
    { restaurantIdx: 7, authorEmail: "foodie@test.com", rating: 5, title: "Wood-fired magic", content: "The octopus and grilled dishes are superb.", tags: ["ambience"] },
    { restaurantIdx: 8, authorEmail: "minimal@test.com", rating: 5, title: "Warm and simple", content: "Beautiful food without the fuss. Real hospitality.", tags: ["service"] },
    { restaurantIdx: 8, authorEmail: "explorer@test.com", rating: 5, title: "Syrian discovery", content: "New flavors for me. Everything was delicious.", tags: ["adventurous", "ambience"] },
    { restaurantIdx: 9, authorEmail: "foodie@test.com", rating: 5, title: "Canadian terroir", content: "Local ingredients shine. Thoughtful and seasonal.", tags: ["healthy", "ambience"] },
    { restaurantIdx: 9, authorEmail: "planner@test.com", rating: 4, title: "Consistent quality", content: "Reliable fine dining. Know what you're getting.", tags: ["service"] },
  ];

  for (const r of sampleReviews) {
    const author = users.find((u) => u.email === r.authorEmail);
    const restaurant = restaurants[r.restaurantIdx];
    const cohort = cohorts.find((c) => c.name === (seedUsers.find((u) => u.email === r.authorEmail)?.cohortName ?? "Explorer"));
    if (author && restaurant && cohort) {
      await prisma.review.upsert({
        where: { id: `${restaurant.id}-${author.id}-${r.title.slice(0, 5)}` },
        update: {},
        create: {
          restaurantId: restaurant.id,
          authorId: author.id,
          authorCohortId: cohort.id,
          rating: r.rating,
          title: r.title,
          content: r.content,
          tags: JSON.stringify(r.tags),
        },
      }).catch(() =>
        prisma.review.create({
          data: {
            restaurantId: restaurant.id,
            authorId: author.id,
            authorCohortId: cohort.id,
            rating: r.rating,
            title: r.title,
            content: r.content,
            tags: JSON.stringify(r.tags),
          },
        })
      );
    }
  }

  console.log("Seed complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
