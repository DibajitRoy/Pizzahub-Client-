import { PageTitle } from "@/components/dashboard/page-title";
import { ProfileForm } from "@/components/profile-form";

export default function ProfilePage() {
  return (
    <>
      <PageTitle title="Profile Settings" subtitle="Update your personal information" />
      <ProfileForm />
    </>
  );
}