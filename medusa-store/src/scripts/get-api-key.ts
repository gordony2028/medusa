import { ExecArgs } from "@medusajs/framework/types";
import { Modules } from "@medusajs/framework/utils";

export default async function getApiKey({ container }: ExecArgs) {
  const apiKeyService = container.resolve(Modules.API_KEY);
  
  const apiKeys = await apiKeyService.listApiKeys({
    type: "publishable"
  });
  
  if (apiKeys.length > 0) {
    console.log('🔑 Found publishable API keys:');
    apiKeys.forEach((key: any, index: number) => {
      console.log(`${index + 1}. Title: ${key.title}`);
      console.log(`   Token: ${key.token}`);
      console.log(`   ID: ${key.id}`);
      console.log('---');
    });
  } else {
    console.log('❌ No publishable API keys found');
  }
}