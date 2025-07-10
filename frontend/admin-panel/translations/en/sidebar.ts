type Sidebar = {
    dashboard: string,
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
    messages: string,
    emails: string,
    donations: string,
    idCards: string,
    foundersList:string,
    recycleBin:string,
    qrGenerator:string,
}

export type SidebarLabels = {
    sideBar: Sidebar;
}

export const sidebarLabels: SidebarLabels = {
    sideBar: {
        dashboard: "Dashboard",
        constituencies: "Constituencies",
        viewConstituencies: "View Constituencies",
        addConstituency: "Add Constituency",
        membership: "Membership",
        memberList: "All Members",
        uploadMembers: "Export Members",
        addMember: "Add Member",
        campaignTools: "Campaign Tools",
        announcements: "Announcements",
        events: "Events",
        mediaResources: "Media & Resources",
        gallery: "Gallery",
        news: "News",
        settings: "Settings",
        messages: "Messages (Single & Bulk SMS)",
        emails: "Emails (Single & Bulk Email)",
        donations: "Donations",
        idCards: "Member ID Cards",
        foundersList: "Founders",
        recycleBin: "Recycle Bin",
        qrGenerator: "QR Generator",
    }
}