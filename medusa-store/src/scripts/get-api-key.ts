/* eslint-disable no-console */
import { ExecArgs } from '@medusajs/framework/types';
import { Modules } from '@medusajs/framework/utils';

export default async function getApiKey({ container }: ExecArgs) {
  const apiKeyService = container.resolve(Modules.API_KEY);

  const apiKeys = await apiKeyService.listApiKeys({
    type: 'publishable',
  });

  if (apiKeys.length > 0) {
    console.log('🔑 Found publishable API keys:');
    apiKeys.forEach((key, index: number) => {
      const apiKey = key as { title: string; token: string; id: string };
      console.log(`${index + 1}. Title: ${apiKey.title}`);
      console.log(`   Token: ${apiKey.token}`);
      console.log(`   ID: ${apiKey.id}`);
      console.log('---');
    });
  } else {
    console.log('❌ No publishable API keys found');
  }
}
