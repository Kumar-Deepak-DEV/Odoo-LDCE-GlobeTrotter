import { PrismaClient, Role, TripStatus, ActivityCategory, CostLevel } from '@prisma/client';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  console.log('Starting exact seeder for GlobeTrotter Hackathon...');

  // Upsert Admin User
  const adminPasswordHash = await bcrypt.hash(process.env.ADMIN_SEED_PASSWORD || 'Admin@2024', 10);
  const adminUser = await prisma.user.upsert({
    where: { email: process.env.ADMIN_SEED_EMAIL || 'admin@globetrotter.com' },
    update: {},
    create: {
      email: process.env.ADMIN_SEED_EMAIL || 'admin@globetrotter.com',
      firstName: 'Admin',
      lastName: 'User',
      passwordHash: adminPasswordHash,
      role: Role.ADMIN,
      city: 'San Francisco',
      country: 'USA'
    }
  });

  // Upsert Demo User
  const demoPasswordHash = await bcrypt.hash('Demo@2024', 10);
  const demoUser = await prisma.user.upsert({
    where: { email: 'demo@globetrotter.com' },
    update: {},
    create: {
      email: 'demo@globetrotter.com',
      firstName: 'Demo',
      lastName: 'User',
      passwordHash: demoPasswordHash,
      role: Role.USER,
      city: 'New York',
      country: 'USA'
    }
  });

  // Create demo trip 1: European Highlights
  let trip1 = await prisma.trip.findFirst({ where: { name: 'European Highlights', userId: demoUser.id }});
  if (!trip1) {
    trip1 = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'European Highlights',
        description: 'A 10-day tour exploring Paris, Rome, and Barcelona.',
        startDate: new Date('2025-05-10T00:00:00Z'),
        endDate: new Date('2025-05-20T00:00:00Z'),
        status: TripStatus.UPCOMING,
        isPublic: true,
        stops: {
          create: [
            {
              cityName: 'Paris',
              country: 'France',
              lat: 48.8566,
              lng: 2.3522,
              startDate: new Date('2025-05-10T00:00:00Z'),
              endDate: new Date('2025-05-13T00:00:00Z'),
              order: 1,
              budget: 1500,
              activities: {
                create: [
                  { name: 'Eiffel Tower Tour', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 50, costLevel: CostLevel.MEDIUM, durationMin: 120, order: 1 },
                  { name: 'Louvre Museum', category: ActivityCategory.CULTURE, dayNumber: 2, cost: 35, costLevel: CostLevel.MEDIUM, durationMin: 180, order: 1 },
                  { name: 'Seine River Cruise', category: ActivityCategory.SIGHTSEEING, dayNumber: 2, cost: 25, costLevel: CostLevel.LOW, durationMin: 60, order: 2 },
                  { name: 'Dinner at Le Jules Verne', category: ActivityCategory.FOOD, dayNumber: 3, cost: 200, costLevel: CostLevel.LUXURY, durationMin: 150, order: 1 }
                ]
              }
            },
            {
              cityName: 'Rome',
              country: 'Italy',
              lat: 41.9028,
              lng: 12.4964,
              startDate: new Date('2025-05-13T00:00:00Z'),
              endDate: new Date('2025-05-17T00:00:00Z'),
              order: 2,
              budget: 1200,
              activities: {
                create: [
                  { name: 'Colosseum & Roman Forum', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 40, costLevel: CostLevel.MEDIUM, durationMin: 240, order: 1 },
                  { name: 'Vatican Museums', category: ActivityCategory.CULTURE, dayNumber: 2, cost: 45, costLevel: CostLevel.MEDIUM, durationMin: 180, order: 1 },
                  { name: 'Pasta Making Class', category: ActivityCategory.FOOD, dayNumber: 3, cost: 80, costLevel: CostLevel.HIGH, durationMin: 180, order: 1 },
                  { name: 'Trevi Fountain Night Walk', category: ActivityCategory.SIGHTSEEING, dayNumber: 3, cost: 0, costLevel: CostLevel.LOW, durationMin: 60, order: 2 }
                ]
              }
            },
            {
              cityName: 'Barcelona',
              country: 'Spain',
              lat: 41.3851,
              lng: 2.1734,
              startDate: new Date('2025-05-17T00:00:00Z'),
              endDate: new Date('2025-05-20T00:00:00Z'),
              order: 3,
              budget: 1000,
              activities: {
                create: [
                  { name: 'Sagrada Familia', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 35, costLevel: CostLevel.MEDIUM, durationMin: 120, order: 1 },
                  { name: 'Park Güell', category: ActivityCategory.NATURE, dayNumber: 2, cost: 15, costLevel: CostLevel.LOW, durationMin: 120, order: 1 },
                  { name: 'Tapas Tour in Gothic Quarter', category: ActivityCategory.FOOD, dayNumber: 2, cost: 60, costLevel: CostLevel.HIGH, durationMin: 150, order: 2 },
                  { name: 'Barceloneta Beach Relax', category: ActivityCategory.WELLNESS, dayNumber: 3, cost: 0, costLevel: CostLevel.LOW, durationMin: 240, order: 1 }
                ]
              }
            }
          ]
        }
      }
    });
  }

  // Create demo trip 2: Asian Getaway
  let trip2 = await prisma.trip.findFirst({ where: { name: 'Asian Getaway', userId: demoUser.id }});
  if (!trip2) {
    trip2 = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'Asian Getaway',
        description: 'A 12-day immersive experience in Tokyo, Kyoto, and Bangkok.',
        startDate: new Date('2025-09-01T00:00:00Z'),
        endDate: new Date('2025-09-12T00:00:00Z'),
        status: TripStatus.UPCOMING,
        isPublic: false,
        stops: {
          create: [
             {
              cityName: 'Tokyo',
              country: 'Japan',
              lat: 35.6762,
              lng: 139.6503,
              startDate: new Date('2025-09-01T00:00:00Z'),
              endDate: new Date('2025-09-05T00:00:00Z'),
              order: 1,
              budget: 2000,
              activities: {
                create: [
                  { name: 'Shibuya Crossing & Hachiko', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 0, costLevel: CostLevel.LOW, durationMin: 90, order: 1 },
                  { name: 'Senso-ji Temple', category: ActivityCategory.CULTURE, dayNumber: 2, cost: 0, costLevel: CostLevel.LOW, durationMin: 90, order: 1 },
                  { name: 'Akihabara Electronics & Anime Tour', category: ActivityCategory.SHOPPING, dayNumber: 3, cost: 30, costLevel: CostLevel.LOW, durationMin: 180, order: 1 },
                  { name: 'Robot Restaurant Show', category: ActivityCategory.NIGHTLIFE, dayNumber: 3, cost: 80, costLevel: CostLevel.HIGH, durationMin: 120, order: 2 }
                ]
              }
            },
            {
              cityName: 'Kyoto',
              country: 'Japan',
              lat: 35.0116,
              lng: 135.7681,
              startDate: new Date('2025-09-05T00:00:00Z'),
              endDate: new Date('2025-09-08T00:00:00Z'),
              order: 2,
              budget: 1200,
              activities: {
                create: [
                  { name: 'Fushimi Inari Shrine', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 0, costLevel: CostLevel.LOW, durationMin: 180, order: 1 },
                  { name: 'Arashiyama Bamboo Grove', category: ActivityCategory.NATURE, dayNumber: 2, cost: 0, costLevel: CostLevel.LOW, durationMin: 120, order: 1 },
                  { name: 'Traditional Tea Ceremony', category: ActivityCategory.CULTURE, dayNumber: 3, cost: 40, costLevel: CostLevel.MEDIUM, durationMin: 90, order: 1 }
                ]
              }
            },
            {
              cityName: 'Bangkok',
              country: 'Thailand',
              lat: 13.7563,
              lng: 100.5018,
              startDate: new Date('2025-09-08T00:00:00Z'),
              endDate: new Date('2025-09-12T00:00:00Z'),
              order: 3,
              budget: 800,
              activities: {
                create: [
                  { name: 'Grand Palace Tour', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 20, costLevel: CostLevel.MEDIUM, durationMin: 150, order: 1 },
                  { name: 'Chatuchak Weekend Market', category: ActivityCategory.SHOPPING, dayNumber: 2, cost: 50, costLevel: CostLevel.MEDIUM, durationMin: 240, order: 1 },
                  { name: 'Khao San Road', category: ActivityCategory.NIGHTLIFE, dayNumber: 3, cost: 15, costLevel: CostLevel.LOW, durationMin: 180, order: 1 },
                  { name: 'Thai Massage', category: ActivityCategory.WELLNESS, dayNumber: 4, cost: 10, costLevel: CostLevel.LOW, durationMin: 60, order: 1 }
                ]
              }
            }
          ]
        }
      }
    });
  }
  
  // Create demo trip 3: South American Explorer
  let trip3 = await prisma.trip.findFirst({ where: { name: 'South American Explorer', userId: demoUser.id }});
  if (!trip3) {
    trip3 = await prisma.trip.create({
      data: {
        userId: demoUser.id,
        name: 'South American Explorer',
        description: '14 days across Rio, Buenos Aires, and Lima.',
        startDate: new Date('2025-11-01T00:00:00Z'),
        endDate: new Date('2025-11-14T00:00:00Z'),
        status: TripStatus.UPCOMING,
        isPublic: true,
        stops: {
          create: [
            {
              cityName: 'Rio de Janeiro',
              country: 'Brazil',
              lat: -22.9068,
              lng: -43.1729,
              startDate: new Date('2025-11-01T00:00:00Z'),
              endDate: new Date('2025-11-05T00:00:00Z'),
              order: 1,
              budget: 1400,
              activities: {
                create: [
                  { name: 'Christ the Redeemer', category: ActivityCategory.SIGHTSEEING, dayNumber: 1, cost: 30, costLevel: CostLevel.MEDIUM, durationMin: 240, order: 1 },
                  { name: 'Copacabana Beach', category: ActivityCategory.NATURE, dayNumber: 2, cost: 0, costLevel: CostLevel.LOW, durationMin: 300, order: 1 },
                  { name: 'Sugarloaf Mountain', category: ActivityCategory.NATURE, dayNumber: 3, cost: 35, costLevel: CostLevel.MEDIUM, durationMin: 180, order: 1 }
                ]
              }
            },
            {
              cityName: 'Buenos Aires',
              country: 'Argentina',
              lat: -34.6037,
              lng: -58.3816,
              startDate: new Date('2025-11-05T00:00:00Z'),
              endDate: new Date('2025-11-10T00:00:00Z'),
              order: 2,
              budget: 1000,
              activities: {
                create: [
                   { name: 'Tango Show', category: ActivityCategory.NIGHTLIFE, dayNumber: 1, cost: 90, costLevel: CostLevel.HIGH, durationMin: 180, order: 1 },
                   { name: 'Recoleta Cemetery', category: ActivityCategory.CULTURE, dayNumber: 2, cost: 5, costLevel: CostLevel.LOW, durationMin: 90, order: 1 },
                   { name: 'Steakhouse Dinner', category: ActivityCategory.FOOD, dayNumber: 3, cost: 50, costLevel: CostLevel.MEDIUM, durationMin: 120, order: 1 }
                ]
              }
            },
            {
              cityName: 'Lima',
              country: 'Peru',
              lat: -12.0464,
              lng: -77.0428,
              startDate: new Date('2025-11-10T00:00:00Z'),
              endDate: new Date('2025-11-14T00:00:00Z'),
              order: 3,
              budget: 800,
              activities: {
                create: [
                  { name: 'Historic Centre of Lima Tour', category: ActivityCategory.CULTURE, dayNumber: 1, cost: 15, costLevel: CostLevel.LOW, durationMin: 180, order: 1 },
                  { name: 'Ceviche Tasting', category: ActivityCategory.FOOD, dayNumber: 2, cost: 40, costLevel: CostLevel.MEDIUM, durationMin: 90, order: 1 },
                  { name: 'Miraflores Boardwalk walk', category: ActivityCategory.NATURE, dayNumber: 3, cost: 0, costLevel: CostLevel.LOW, durationMin: 120, order: 1 }
                ]
              }
            }
          ]
        }
      }
    });
  }

  console.log('Seeding completed successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
