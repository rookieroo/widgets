function actions(router) {
  return [
    {
      id: "home",
      name: "Home",
      shortcut: ["h"],
      keywords: "home index",
      perform: () => router("/"),
      type: "link",
      section: "navigation",
    },
    {
      id: "timeline",
      name: "Timeline",
      shortcut: ["t"],
      keywords: "nav timeline",
      perform: () => router("timeline"),
      type: "link",
      section: "navigation",
    },
    {
      id: "hashtags",
      name: "Hashtags",
      shortcut: ["h"],
      keywords: "nav tags",
      perform: () => router("hashtags"),
      type: "link",
      section: "navigation",
    },
    {
      id: "friends",
      name: "Friends",
      shortcut: ["f"],
      keywords: "nav friends",
      perform: () => router("friends"),
      type: "link",
      section: "navigation",
    },
    {
      id: "about",
      name: "About",
      shortcut: ["a"],
      keywords: "nav about",
      perform: () => router("about"),
      type: "link",
      section: "navigation",
    },
    {
      id: "contact",
      name: "Contact",
      shortcut: ["c"],
      keywords: "email",
      perform: () => window.open("mailto:chrisding03@gmail.com"),
      type: "contact",
      section: "other",
    },
    {
      id: "github",
      name: "Github",
      shortcut: ["g"],
      keywords: "git github",
      perform: () =>
        window.open("https://github.com/rookieroo", "_blank"),
      type: "github",
      section: "other",
    },
    {
      id: "twitter",
      name: "Twitter",
      shortcut: ["t"],
      keywords: "twitter tweet contact",
      perform: () => window.open("https://twitter.com/chrisding03", "_blank"),
      type: "twitter",
      section: "other",
    },
  ];
}

export default actions;
