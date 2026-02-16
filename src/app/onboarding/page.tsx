import { RequireOnboarding } from "@/components/require-onboarding";
import { OnboardingQuiz } from "@/components/onboarding-quiz";

export default function OnboardingPage() {
  return (
    <RequireOnboarding>
      <OnboardingQuiz />
    </RequireOnboarding>
  );
}
