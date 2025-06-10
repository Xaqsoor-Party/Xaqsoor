import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import UserDataDisplay from "@/components/settings/UserDataDisplay/UserDataDisplay";

const app = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Profile', link: '/profile' },
        { label: 'Settings', link: '/profile/settings' },
    ];

  return (
      <div>
          <UserDataDisplay />
      </div>
  )
}
export default app;