type Sidebar = {
    dashboard: string,
    donate: string,
    constituencies: string,
    viewConstituencies: string,
    addConstituency: string,
    membership: string,
    memberList: string,
    uploadMembers: string,
    addMember: string,
    campaignTools: string,
    announcements: string,
    events: string,
    mediaResources: string,
    gallery: string,
    news: string,
    settings: string,
}

export type SidebarLabels = {
    sideBar: Sidebar;
}

export const sidebarLabels: SidebarLabels = {
    sideBar: {
        dashboard: "Dashboard",
        donate: "Donate",
        constituencies: "Constituencies",
        viewConstituencies: "View Constituencies",
        addConstituency: "Add Constituency",
        membership: "Membership",
        memberList: "All Members",
        uploadMembers: "Import Members",
        addMember: "Add Member",
        campaignTools: "Campaign Tools",
        announcements: "Announcements",
        events: "Events",
        mediaResources: "Media & Resources",
        gallery: "Gallery",
        news: "News",
        settings: "Settings",
    }
}