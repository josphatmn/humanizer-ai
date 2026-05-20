import { SignIn } from "@clerk/nextjs";

export default function SignInPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-950">
      <SignIn
        appearance={{
          elements: {
            rootBox: "mx-auto",
            card: "bg-dark-900 border border-dark-700/50 shadow-2xl",
            headerTitle: "text-white",
            headerSubtitle: "text-dark-400",
            socialButtonsBlockButton:
              "bg-dark-800 border-dark-700 text-white hover:bg-dark-700",
            formFieldLabel: "text-dark-300",
            formFieldInput:
              "bg-dark-800 border-dark-700 text-white focus:border-brand-500",
            footerActionLink: "text-brand-500 hover:text-brand-400",
            dividerLine: "bg-dark-700",
            dividerText: "text-dark-500",
            formButtonPrimary: "bg-gradient-brand hover:bg-gradient-brand-hover",
          },
        }}
      />
    </div>
  );
}
