/* eslint-disable no-console */
import { ExecArgs } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';

export default async function listUsers({ container }: ExecArgs) {
  const userService = container.resolve(Modules.USER);

  try {
    const users = await userService.listUsers();

    console.log(`\n👥 Found ${users.length} users in database:`);

    users.forEach((user, index) => {
      console.log(`\n${index + 1}. User:`);
      console.log(`   ID: ${user.id}`);
      console.log(`   Email: ${user.email}`);
      console.log(`   Name: ${user.first_name} ${user.last_name}`);
      console.log(
        `   Created: ${user.created_at instanceof Date ? user.created_at.toISOString() : user.created_at}`
      );
    });

    if (users.length === 0) {
      console.log(`\n❌ No users found in database`);
      console.log(
        `💡 Run the seed script or create-admin script to create users`
      );
    }
  } catch (error) {
    console.error(
      'Error listing users:',
      error instanceof Error ? error.message : String(error)
    );
  }
}
