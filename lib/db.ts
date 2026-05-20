export interface UserSubscription {
  userId: string;
  tier: "free" | "stealth_author" | "incognito_agency";
  wordsUsed: number;
  wordsLimit: number;
  stripeCustomerId: string | null;
  stripeSubscriptionId: string | null;
  subscriptionStatus: "active" | "canceled" | "past_due" | "trialing";
  updatedAt: Date;
}

const userSubscriptions = new Map<string, UserSubscription>();

export async function getUserSubscription(
  userId: string
): Promise<UserSubscription> {
  const existing = userSubscriptions.get(userId);
  if (existing) return existing;

  const defaultSubscription: UserSubscription = {
    userId,
    tier: "free",
    wordsUsed: 0,
    wordsLimit: 3000,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
    subscriptionStatus: "active",
    updatedAt: new Date(),
  };

  userSubscriptions.set(userId, defaultSubscription);
  return defaultSubscription;
}

export async function updateUserSubscription(
  userId: string,
  updates: Partial<UserSubscription>
): Promise<UserSubscription> {
  const current = await getUserSubscription(userId);
  const updated = { ...current, ...updates, updatedAt: new Date() };
  userSubscriptions.set(userId, updated);
  return updated;
}

export async function incrementWordsUsed(
  userId: string,
  wordCount: number
): Promise<UserSubscription> {
  const current = await getUserSubscription(userId);
  return updateUserSubscription(userId, {
    wordsUsed: current.wordsUsed + wordCount,
  });
}
