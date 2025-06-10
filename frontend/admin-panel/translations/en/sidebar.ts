type Sidebar = {
    dashboard: string,
    candidates: string,
    allCandidates: string,
    addCandidate: string,
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
    documents: string,
    settings: string,
}

export type SidebarLabels = {
    sideBar: Sidebar;
}

export const sidebarLabels: SidebarLabels = {
    sideBar: {
        dashboard: "Dashboard",
        candidates: "Candidates",
        allCandidates: "All Candidates",
        addCandidate: "Add Candidate",
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
        documents: "Documents",
        settings: "Settings",
    }
}