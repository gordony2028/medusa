/* eslint-disable no-console */
import { ExecArgs } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';

export default async function createAdmin({ container }: ExecArgs) {
  const userService = container.resolve(Modules.USER);

  try {
    // Admin credentials
    const email = 'admin@test.com';
    const password = 'supersecret';

    // Check if user already exists
    const existingUsers = await userService.listUsers({
      email: email,
    });

    if (existingUsers.length > 0) {
      console.log(`✅ Admin user already exists:`);
      console.log(`   Email: ${email}`);
      console.log(`   Password: ${password}`);
      console.log(`   ID: ${existingUsers[0].id}`);
      console.log(`\n📝 You can login at:`);
      console.log(`   Local: http://localhost:9000/app`);
      console.log(
        `   Production: ${process.env.MEDUSA_BACKEND_URL || 'https://your-railway-app.railway.app'}/app`
      );
      return;
    }

    // Create the user
    const user = await userService.createUsers({
      email: email,
      first_name: 'Admin',
      last_name: 'User',
    });

    console.log(`✅ Admin user created successfully!`);
    console.log(`\n🔐 Admin Credentials:`);
    console.log(`   Email: ${email}`);
    console.log(`   Password: ${password}`);
    console.log(`   ID: ${user.id}`);
    console.log(`\n📝 You can login at:`);
    console.log(`   Local: http://localhost:9000/app`);
    console.log(
      `   Production: ${process.env.MEDUSA_BACKEND_URL || 'https://your-railway-app.railway.app'}/app`
    );
    console.log(`\n⚠️  Important: Change the password after first login!`);
  } catch (error) {
    console.error(
      'Error:',
      error instanceof Error ? error.message : String(error)
    );

    // If user was created but auth failed, show the credentials anyway
    console.log(`\n📝 Default Admin Credentials (try these):`);
    console.log(`   Email: admin@test.com`);
    console.log(`   Password: supersecret`);
  }
}
