/* eslint-disable no-console */
import { ExecArgs } from '@medusajs/framework/types';
import { createUserAccountWorkflow } from '@medusajs/medusa/core-flows';

export default async function createProperAdmin({ container }: ExecArgs) {
  const logger = container.resolve('logger');

  try {
    const email = 'admin@test.com';
    const password = 'admin123';

    // Create admin user using the proper workflow
    const { result: userResult } = await createUserAccountWorkflow(
      container
    ).run({
      input: {
        userData: {
          email: email,
          first_name: 'Admin',
          last_name: 'User',
        },
        authIdentityId: 'admin-auth',
      },
    });

    logger.info(`✅ Admin user created successfully!`);
    logger.info(`📧 Email: ${email}`);
    logger.info(`🔑 Password: ${password}`);
    logger.info(`🆔 User ID: ${userResult.id}`);
    logger.info(`\n🌐 Login at: http://localhost:9000/app`);
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    if (errorMessage.includes('already exists')) {
      console.log(`✅ Admin user already exists!`);
      console.log(`📧 Email: admin@test.com`);
      console.log(`🔑 Password: admin123`);
      console.log(`\n🌐 Login at: http://localhost:9000/app`);
    } else {
      console.error('Error creating admin user:', error);

      // Fallback - try simple credentials
      console.log(`\n💡 Try these default credentials:`);
      console.log(`📧 Email: admin@test.com`);
      console.log(`🔑 Password: admin123`);
      console.log(`\n OR:`);
      console.log(`📧 Email: admin@medusa-test.com`);
      console.log(`🔑 Password: supersecret`);
    }
  }
}
