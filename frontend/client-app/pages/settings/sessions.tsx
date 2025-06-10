import Breadcrumb from "@/components/Breadcrumb/Breadcrumb";
import React from "react";

const Sessions = () => {
    const breadcrumbData = [
        { label: 'Home', link: '/' },
        { label: 'Settings', link: '/settings' },
        { label: 'Active Sessions', link: '/settings/sessions' },
    ];

    return (
      <div>
          <Breadcrumb breadcrumbs={breadcrumbData} />
      </div>
  );
}
export default Sessions;