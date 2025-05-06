// import { MetadataRoute } from "next";

// This function generates the sitemap entries
export default function sitemap() {
  // Define the base URL of your website
  const baseUrl = "https://juliendsv.com";

  // Return an array of sitemap entries
  return [
    {
      url: baseUrl,
      lastModified: new Date(), // Use the current date as the last modification date
      changeFrequency: "yearly", // How often the content is expected to change
      priority: 1, // The priority of this URL relative to other URLs on your site (0.0 to 1.0)
    },
    // Add more static or dynamic routes here
    // Example for a static route:
    // {
    //   url: `${baseUrl}/about`,
    //   lastModified: new Date(),
    //   changeFrequency: 'monthly',
    //   priority: 0.8,
    // },
    // Example for fetching dynamic routes (e.g., blog posts):
    // const posts = await fetchPostsFromDB();
    // ...posts.map((post) => ({
    //   url: `${baseUrl}/blog/${post.slug}`,
    //   lastModified: post.updatedAt,
    //   changeFrequency: 'weekly',
    //   priority: 0.5,
    // }))
  ];
}
