export const initialConversations = [
  {
    id: "conv-1",
    title: "Dengue symptoms",
    group: "Today",
    timestamp: "10:30 AM",
    updatedAt: new Date().toISOString(),
  },
  {
    id: "conv-2",
    title: "Headache causes",
    group: "Today",
    timestamp: "8:15 AM",
    updatedAt: new Date(Date.now() - 2 * 3600000).toISOString(),
  },
  {
    id: "conv-3",
    title: "Fever treatment",
    group: "Yesterday",
    timestamp: "Yesterday",
    updatedAt: new Date(Date.now() - 24 * 3600000).toISOString(),
  },
  {
    id: "conv-4",
    title: "Vitamin D benefits",
    group: "Yesterday",
    timestamp: "Yesterday",
    updatedAt: new Date(Date.now() - 28 * 3600000).toISOString(),
  },
  {
    id: "conv-5",
    title: "Flu symptoms",
    group: "Previous 7 Days",
    timestamp: "3 days ago",
    updatedAt: new Date(Date.now() - 72 * 3600000).toISOString(),
  },
  {
    id: "conv-6",
    title: "Blood pressure",
    group: "Previous 7 Days",
    timestamp: "5 days ago",
    updatedAt: new Date(Date.now() - 120 * 3600000).toISOString(),
  },
  {
    id: "conv-7",
    title: "Common allergies",
    group: "Previous 7 Days",
    timestamp: "6 days ago",
    updatedAt: new Date(Date.now() - 144 * 3600000).toISOString(),
  }
];

export const mockUser = {
  name: "John Doe",
  username: "johndoe",
  email: "john.doe@example.com",
  avatarUrl: null,
  initials: "JN",
  role: "Free Account"
};
