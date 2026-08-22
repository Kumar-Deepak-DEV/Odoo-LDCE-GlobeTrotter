import http from 'http';
import { createApp } from './app';
import { prisma } from './config/prisma';

interface TestResult {
  num: number;
  category: string;
  method: string;
  path: string;
  expectedStatus: number | number[];
  actualStatus: number;
  success: boolean;
  notes?: string;
  responseDataSnippet?: string;
}

const results: TestResult[] = [];

async function runRouteTests() {
  console.log('🚀 Starting GlobeTrotter Backend Endpoint Audit...\n');

  const app = createApp();
  const server = http.createServer(app);

  await new Promise<void>((resolve) => {
    server.listen(0, () => resolve());
  });

  const address = server.address() as { port: number };
  const baseUrl = `http://127.0.0.1:${address.port}`;

  async function request(
    method: string,
    endpoint: string,
    options: {
      headers?: Record<string, string>;
      body?: unknown;
    } = {}
  ): Promise<{ status: number; data: any; raw: string }> {
    const headers: Record<string, string> = {
      ...(options.headers || {}),
    };

    let bodyStr: string | undefined;
    if (options.body) {
      headers['Content-Type'] = 'application/json';
      bodyStr = JSON.stringify(options.body);
    }

    const res = await fetch(`${baseUrl}${endpoint}`, {
      method,
      headers,
      body: bodyStr,
    });

    const raw = await res.text();
    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      data = raw;
    }

    return { status: res.status, data, raw };
  }

  let testNum = 1;
  function record(
    category: string,
    method: string,
    path: string,
    expectedStatus: number | number[],
    actualStatus: number,
    response: any,
    notes?: string
  ) {
    const allowed = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
    const isSuccess = allowed.includes(actualStatus);
    const snippet =
      typeof response === 'object'
        ? JSON.stringify(response).slice(0, 120) + (JSON.stringify(response).length > 120 ? '...' : '')
        : String(response).slice(0, 120);

    results.push({
      num: testNum++,
      category,
      method,
      path,
      expectedStatus,
      actualStatus,
      success: isSuccess,
      notes,
      responseDataSnippet: snippet,
    });

    const statusBadge = isSuccess ? '✅ PASS' : '❌ FAIL';
    console.log(
      `${statusBadge} [${method}] ${path} -> Status: ${actualStatus} (Expected: ${allowed.join('/')})`
    );
  }

  try {
    // 1. Root landing
    const resRoot = await request('GET', '/');
    record('System', 'GET', '/', 200, resRoot.status, resRoot.data);

    // 2. Health check
    const resHealth = await request('GET', '/api/health');
    record('System', 'GET', '/api/health', 200, resHealth.status, resHealth.data);

    // 3. Admin Login
    const adminLoginRes = await request('POST', '/api/auth/login', {
      body: {
        email: 'admin@globetrotter.com',
        password: 'Admin@2024',
      },
    });
    record('Auth', 'POST', '/api/auth/login (Admin)', 200, adminLoginRes.status, adminLoginRes.data);
    const adminToken = adminLoginRes.data?.data?.token;

    // 4. Demo User Login
    const demoLoginRes = await request('POST', '/api/auth/login', {
      body: {
        email: 'demo@globetrotter.com',
        password: 'Demo@2024',
      },
    });
    record('Auth', 'POST', '/api/auth/login (Demo User)', 200, demoLoginRes.status, demoLoginRes.data);
    const demoToken = demoLoginRes.data?.data?.token;
    const demoUserId = demoLoginRes.data?.data?.user?.id;

    // 5. Register New User
    const testEmail = `test_${Date.now()}@globetrotter.com`;
    const regRes = await request('POST', '/api/auth/register', {
      body: {
        email: testEmail,
        password: 'Password123!',
        firstName: 'Test',
        lastName: 'Tester',
        city: 'Seattle',
        country: 'USA',
      },
    });
    record('Auth', 'POST', '/api/auth/register', 201, regRes.status, regRes.data);
    const userToken = regRes.data?.data?.token;
    const userId = regRes.data?.data?.user?.id;

    const userAuthHeaders = { Authorization: `Bearer ${userToken}` };
    const demoAuthHeaders = { Authorization: `Bearer ${demoToken}` };
    const adminAuthHeaders = { Authorization: `Bearer ${adminToken}` };

    // 6. Get Auth Me
    const meRes = await request('GET', '/api/auth/me', { headers: userAuthHeaders });
    record('Auth', 'GET', '/api/auth/me', 200, meRes.status, meRes.data);

    // 7. Forgot password
    const forgotRes = await request('POST', '/api/auth/forgot-password', {
      body: { email: testEmail },
    });
    record('Auth', 'POST', '/api/auth/forgot-password', 200, forgotRes.status, forgotRes.data);

    // 8. Reset password
    const resetRes = await request('POST', '/api/auth/reset-password', {
      body: { token: 'mock-token-sample', newPassword: 'NewPassword123!' },
    });
    record('Auth', 'POST', '/api/auth/reset-password', 200, resetRes.status, resetRes.data);

    // 9. Get User Profile
    const profileRes = await request('GET', '/api/users/profile', { headers: userAuthHeaders });
    record('User', 'GET', '/api/users/profile', 200, profileRes.status, profileRes.data);

    // 10. Get User Profile Alias (/api/users/me)
    const profileMeRes = await request('GET', '/api/users/me', { headers: userAuthHeaders });
    record('User', 'GET', '/api/users/me', 200, profileMeRes.status, profileMeRes.data);

    // 11. Get User by ID
    const profileIdRes = await request('GET', `/api/users/${userId}`, { headers: userAuthHeaders });
    record('User', 'GET', `/api/users/:id`, 200, profileIdRes.status, profileIdRes.data);

    // 12. Update Profile
    const updateProfileRes = await request('PUT', '/api/users/profile', {
      headers: userAuthHeaders,
      body: {
        firstName: 'UpdatedTester',
        bio: 'Avid traveler and explorer!',
      },
    });
    record('User', 'PUT', '/api/users/profile', 200, updateProfileRes.status, updateProfileRes.data);

    // 13. Create Trip
    const createTripRes = await request('POST', '/api/trips', {
      headers: userAuthHeaders,
      body: {
        name: 'Grand Himalayan Adventure',
        description: 'Trekking through scenic mountain passes',
        startDate: '2026-06-01T00:00:00Z',
        endDate: '2026-06-15T00:00:00Z',
        status: 'UPCOMING',
        isPublic: false,
      },
    });
    record('Trip', 'POST', '/api/trips', 201, createTripRes.status, createTripRes.data);
    const createdTrip = createTripRes.data?.data?.trip;
    const tripId = createdTrip?.id;

    // 14. List Trips
    const listTripsRes = await request('GET', '/api/trips?status=UPCOMING&page=1&limit=10', {
      headers: userAuthHeaders,
    });
    record('Trip', 'GET', '/api/trips', 200, listTripsRes.status, listTripsRes.data);

    // 15. Get Trip By ID
    const getTripRes = await request('GET', `/api/trips/${tripId}`, { headers: userAuthHeaders });
    record('Trip', 'GET', `/api/trips/:id`, 200, getTripRes.status, getTripRes.data);

    // 16. Update Trip
    const updateTripRes = await request('PUT', `/api/trips/${tripId}`, {
      headers: userAuthHeaders,
      body: {
        name: 'Grand Himalayan & Valley Trek',
        description: 'Updated trek itinerary and planning notes',
      },
    });
    record('Trip', 'PUT', `/api/trips/:id`, 200, updateTripRes.status, updateTripRes.data);

    // 17. Add Stop 1 to Trip
    const addStop1Res = await request('POST', `/api/trips/${tripId}/stops`, {
      headers: userAuthHeaders,
      body: {
        cityName: 'Kathmandu',
        country: 'Nepal',
        lat: 27.7172,
        lng: 85.324,
        startDate: '2026-06-01T00:00:00Z',
        endDate: '2026-06-05T00:00:00Z',
        budget: 600,
        order: 1,
      },
    });
    record('Stop', 'POST', `/api/trips/:tripId/stops (Stop 1)`, 201, addStop1Res.status, addStop1Res.data);
    const stop1Id = addStop1Res.data?.data?.stop?.id;

    // 18. Add Stop 2 to Trip
    const addStop2Res = await request('POST', `/api/trips/${tripId}/stops`, {
      headers: userAuthHeaders,
      body: {
        cityName: 'Pokhara',
        country: 'Nepal',
        lat: 28.2096,
        lng: 83.9856,
        startDate: '2026-06-05T00:00:00Z',
        endDate: '2026-06-10T00:00:00Z',
        budget: 500,
        order: 2,
      },
    });
    record('Stop', 'POST', `/api/trips/:tripId/stops (Stop 2)`, 201, addStop2Res.status, addStop2Res.data);
    const stop2Id = addStop2Res.data?.data?.stop?.id;

    // 19. Update Stop
    const updateStopRes = await request('PUT', `/api/stops/${stop1Id}`, {
      headers: userAuthHeaders,
      body: {
        budget: 750,
      },
    });
    record('Stop', 'PUT', `/api/stops/:id`, 200, updateStopRes.status, updateStopRes.data);

    // 20. Reorder Stops
    const reorderStopsRes = await request('PUT', `/api/trips/${tripId}/stops/reorder`, {
      headers: userAuthHeaders,
      body: {
        stopIds: [stop2Id, stop1Id],
      },
    });
    record('Stop', 'PUT', `/api/trips/:tripId/stops/reorder`, 200, reorderStopsRes.status, reorderStopsRes.data);

    // 21. Add Activity 1 to Stop
    const addAct1Res = await request('POST', `/api/stops/${stop1Id}/activities`, {
      headers: userAuthHeaders,
      body: {
        name: 'Swayambhunath Monkey Temple',
        category: 'CULTURE',
        dayNumber: 1,
        cost: 15,
        costLevel: 'LOW',
        durationMin: 120,
        notes: 'Great panoramic view of the Kathmandu valley.',
      },
    });
    record('Activity', 'POST', `/api/stops/:stopId/activities (Act 1)`, 201, addAct1Res.status, addAct1Res.data);
    const act1Id = addAct1Res.data?.data?.activity?.id;

    // 22. Add Activity 2 to Stop
    const addAct2Res = await request('POST', `/api/stops/${stop1Id}/activities`, {
      headers: userAuthHeaders,
      body: {
        name: 'Mountain Flight Everest View',
        category: 'ADVENTURE',
        dayNumber: 2,
        cost: 220,
        costLevel: 'LUXURY',
        durationMin: 60,
      },
    });
    record('Activity', 'POST', `/api/stops/:stopId/activities (Act 2)`, 201, addAct2Res.status, addAct2Res.data);
    const act2Id = addAct2Res.data?.data?.activity?.id;

    // 23. Update Activity
    const updateActRes = await request('PUT', `/api/activities/${act1Id}`, {
      headers: userAuthHeaders,
      body: {
        notes: 'Bring water and camera for sunrise view.',
      },
    });
    record('Activity', 'PUT', `/api/activities/:id`, 200, updateActRes.status, updateActRes.data);

    // 24. Search Activities
    const searchActRes = await request('GET', '/api/activities/search?category=CULTURE');
    record('Activity', 'GET', '/api/activities/search', 200, searchActRes.status, searchActRes.data);

    // 25. City Popular
    const popularCitiesRes = await request('GET', '/api/cities/popular?limit=5');
    record('City', 'GET', '/api/cities/popular', 200, popularCitiesRes.status, popularCitiesRes.data);

    // 26. City Search
    const searchCitiesRes = await request('GET', '/api/cities/search?q=Paris&limit=3');
    record('City', 'GET', '/api/cities/search', 200, searchCitiesRes.status, searchCitiesRes.data);

    // 27. Trip Budget Breakdown
    const budgetRes = await request('GET', `/api/budget/${tripId}`, { headers: userAuthHeaders });
    record('Budget', 'GET', `/api/budget/:id`, 200, budgetRes.status, budgetRes.data);

    // 28. Trip Budget via Trips Router (/api/trips/:id/budget)
    const tripBudgetRes = await request('GET', `/api/trips/${tripId}/budget`, { headers: userAuthHeaders });
    record('Budget', 'GET', `/api/trips/:id/budget`, 200, tripBudgetRes.status, tripBudgetRes.data);

    // 28b. Trip Budget Alias (/api/budget/trips/:id)
    const budgetAliasRes = await request('GET', `/api/budget/trips/${tripId}`, { headers: userAuthHeaders });
    record('Budget', 'GET', `/api/budget/trips/:id`, 200, budgetAliasRes.status, budgetAliasRes.data);

    // 29. Dashboard Stats
    const dashRes = await request('GET', '/api/dashboard/stats', { headers: userAuthHeaders });
    record('Dashboard', 'GET', '/api/dashboard/stats', 200, dashRes.status, dashRes.data);

    // 30. Publish Trip
    const publishRes = await request('POST', `/api/trips/${tripId}/publish`, { headers: userAuthHeaders });
    record('Trip', 'POST', `/api/trips/:id/publish`, 200, publishRes.status, publishRes.data);
    const shareSlug = publishRes.data?.data?.shareSlug;

    // 31. Get Public Trip by Slug
    const publicSlugRes = await request('GET', `/api/trips/public/${shareSlug}`);
    record('Trip', 'GET', `/api/trips/public/:slug`, 200, publicSlugRes.status, publicSlugRes.data);

    // 32. Public Trip Alias (/api/public/trips/:slug)
    const publicAliasRes = await request('GET', `/api/public/trips/${shareSlug}`);
    record('Trip', 'GET', `/api/public/trips/:slug`, 200, publicAliasRes.status, publicAliasRes.data);

    // 33. Copy Trip
    const copyTripRes = await request('POST', `/api/trips/${tripId}/copy`, { headers: userAuthHeaders });
    record('Trip', 'POST', `/api/trips/:id/copy`, 201, copyTripRes.status, copyTripRes.data);
    const copiedTripId = copyTripRes.data?.data?.trip?.id;

    // 34. Community List Posts / Trips
    const commListRes = await request('GET', '/api/community');
    record('Community', 'GET', '/api/community', 200, commListRes.status, commListRes.data);

    // 35. Community Posts Alias
    const commPostsRes = await request('GET', '/api/community/posts');
    record('Community', 'GET', '/api/community/posts', 200, commPostsRes.status, commPostsRes.data);

    // 36. Share Trip to Community Post
    const shareCommRes = await request('POST', '/api/community', {
      headers: userAuthHeaders,
      body: {
        tripId,
        title: 'Himalayan Exploration Itinerary',
        content: 'Check out my full 2-week Nepal Himalayan adventure route!',
      },
    });
    record('Community', 'POST', '/api/community', 201, shareCommRes.status, shareCommRes.data);

    // 37. Admin List Users
    const adminUsersRes = await request('GET', '/api/admin/users', { headers: adminAuthHeaders });
    record('Admin', 'GET', '/api/admin/users', 200, adminUsersRes.status, adminUsersRes.data);

    // 38. Admin System Stats
    const adminStatsRes = await request('GET', '/api/admin/stats', { headers: adminAuthHeaders });
    record('Admin', 'GET', '/api/admin/stats', 200, adminStatsRes.status, adminStatsRes.data);

    // 39. Delete Activity
    const delActRes = await request('DELETE', `/api/activities/${act2Id}`, { headers: userAuthHeaders });
    record('Activity', 'DELETE', `/api/activities/:id`, 200, delActRes.status, delActRes.data);

    // 40. Delete Stop
    const delStopRes = await request('DELETE', `/api/stops/${stop2Id}`, { headers: userAuthHeaders });
    record('Stop', 'DELETE', `/api/stops/:id`, 200, delStopRes.status, delStopRes.data);

    // 41. Delete Copied Trip
    const delCopiedRes = await request('DELETE', `/api/trips/${copiedTripId}`, { headers: userAuthHeaders });
    record('Trip', 'DELETE', `/api/trips/:id (Copied Trip)`, 200, delCopiedRes.status, delCopiedRes.data);

    // 42. Delete Primary Trip
    const delTripRes = await request('DELETE', `/api/trips/${tripId}`, { headers: userAuthHeaders });
    record('Trip', 'DELETE', `/api/trips/:id`, 200, delTripRes.status, delTripRes.data);

    // 43. Admin Delete Test User
    const adminDelUserRes = await request('DELETE', `/api/admin/users/${userId}`, { headers: adminAuthHeaders });
    record('Admin', 'DELETE', `/api/admin/users/:id`, 200, adminDelUserRes.status, adminDelUserRes.data);

    // 44. Negative Test: 404 Route Not Found
    const notFoundRes = await request('GET', '/api/non-existent-route-xyz');
    record('Error Handling', 'GET', '/api/non-existent-route-xyz', 404, notFoundRes.status, notFoundRes.data);

    // 45. Negative Test: 401 Unauthorized without Token
    const unauthRes = await request('GET', '/api/dashboard/stats');
    record('Error Handling', 'GET', '/api/dashboard/stats (No Auth)', 401, unauthRes.status, unauthRes.data);

    // 46. Negative Test: 403 Forbidden on Admin Endpoint with Non-Admin Token
    const forbiddenRes = await request('GET', '/api/admin/stats', { headers: demoAuthHeaders });
    record('Error Handling', 'GET', '/api/admin/stats (Non-Admin User)', 403, forbiddenRes.status, forbiddenRes.data);

    // 47. Negative Test: 400 Validation Error on invalid payload
    const invalidRegRes = await request('POST', '/api/auth/register', {
      body: {
        email: 'not-an-email',
        password: 'short',
      },
    });
    record('Error Handling', 'POST', '/api/auth/register (Invalid Input)', 400, invalidRegRes.status, invalidRegRes.data);
  } finally {
    server.close();
    await prisma.$disconnect();
  }

  // Print Summary Table
  console.log('\n======================================================');
  console.log('                 ENDPOINT AUDIT SUMMARY                ');
  console.log('======================================================');
  const total = results.length;
  const passed = results.filter((r) => r.success).length;
  const failed = total - passed;

  console.log(`Total Endpoints Checked: ${total}`);
  console.log(`Passed: ${passed}`);
  console.log(`Failed: ${failed}`);

  if (failed > 0) {
    console.log('\nFAILED ENDPOINTS:');
    for (const r of results.filter((r) => !r.success)) {
      console.log(`❌ [${r.method}] ${r.path} -> Expected: ${r.expectedStatus}, Got: ${r.actualStatus}`);
      console.log(`   Response: ${r.responseDataSnippet}`);
    }
  }

  console.log('======================================================\n');
}

runRouteTests().catch((err) => {
  console.error('Audit Script Error:', err);
  process.exit(1);
});
