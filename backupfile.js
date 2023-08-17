// store only webshow and season not episode
// export const collectDataThroughApi = async (request, response) => {
//     try {
//       const apiRequests = [];
  
//       for (let i = 0; i <= 1000; i++) {
//         const apiUrl = `https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
//         apiRequests.push(
//           axios
//             .get(apiUrl)
//             .then((response) => response.data)
//             .catch((error) => {
//               return []; // Return an empty array for failed requests
//             })
//         );
//       }
  
      
//       const responses = await Promise.all(apiRequests);
//       const recordsToInsert = responses
//         .filter(
//           (responseData) => Array.isArray(responseData) && responseData.length > 0
//         )
//         .flat();
  
//       for (const record of recordsToInsert) {
//         const {
//           title,
//           label,
//           sublabel,
//           type,
//           description,
//           year,
//           imdb,
//           comment,
//           downloadas,
//           classification,
//           image,
//           cover,
//           genres,
//           trailer,
//         } = record;
  
//         // Process the tags using your extractTagsFromGenres function
//         const tags = extractTagsFromGenres(genres);
  
//         const webSeriesDocument = {
//           title,
//           label,
//           sublabel,
//           type,
//           description,
//           year,
//           rating: imdb,
//           enable: comment,
//           downloadas,
//           classification,
//           poster: image,
//           banner: cover,
//           tags,
//           trailer: trailer ? trailer.url : null,
//         };
  
//         // Insert record into the first collection
//         const insertedRecord = await allWebShowRoot.create(webSeriesDocument);
  
//         const webSeasons = {
//           title,
//           label,
//           sublabel,
//           type,
//           description,
//           year,
//           rating: imdb,
//           enable: comment,
//           downloadas,
//           classification,
//           poster: image,
//           banner: cover,
//           tags,
//           trailer: trailer ? trailer.url : null,
//         };
  
//         webSeasons.webshow_id = insertedRecord._id;
//         webSeasons.season_number = 1;
  
//         console.log(webSeasons);
//         // // Insert the same record into another collection with reference to the first collection's _id
//         const recordWithRefId = { ...webSeriesDocument, referenceId: insertedRecord._id };
//         await seasonSchema.create(webSeasons);
  
     
//       }
  
//       response.json({
//         success: true,
//         message: "Records inserted successfully",
//       });
//     } catch (error) {
//       response.status(500).json({
//         success: false,
//         message: "An error occurred",
//         error: error.message,
//       });
//     }
//   };
  
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const apiRequests = [];
  //     const records = [];
  
  //     for (let i = 0; i <= 1000; i++) {
  //       const apiUrl = `https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //       apiRequests.push(
  //         axios
  //           .get(apiUrl)
  //           .then(response => response.data)
  //           .catch(error => {
  //             // console.error(`Error fetching data for API ${i}:`, error);
  //             return []; // Return an empty array for failed requests
  //           })
  //       );
  //     }
  
  //     const responses = await Promise.all(apiRequests);
  //     responses.forEach(responseData => {
  //       if (Array.isArray(responseData) && responseData.length > 0) {
  //         records.push(responseData);
  //       }
  //     });
  
  //     // Process the records to keep only the required fields and modify the trailer field
  //     const processedRecords = records
  //       .flat()
  //       .map(({ title, label, sublabel, type, description, year, imdb, comment, downloadas, classification, image, cover, genres, trailer }) => ({
  //         title,
  //         label,
  //         sublabel,
  //         type,
  //         description,
  //         year,
  //         rating : imdb,
  //         enable : comment,
  //         downloadas,
  //         classification,
  //         poster : image,
  //         banner : cover,
  //         tags: extractTagsFromGenres(genres), // Use the helper function to get tags from genres
  //         // sourceUrl_language_files: trailer ? convertTrailerFormat(trailer.url) : null
  //         trailer: trailer ? trailer.url : null
  //       }));
  
  //     response.json(records);
  //   } catch (error) {
  //     // console.error('Error:', error.message);
  //     // response.status(500).send('An error occurred.');
  //   }
  // };
  
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const firstApiUrl = 'https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/';
  //     const secondApiBaseUrl = 'https://moontv.live/api/season/by/serie/';
  
  //     const firstApiResponses = await Promise.all(
  //       Array.from({ length: 1001 }, (_, i) => i).map(async (i) => {
  //         try {
  //           const apiUrl = `${firstApiUrl}${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //           const response = await axios.get(apiUrl);
  //           return Array.isArray(response.data) && response.data.length > 0 ? response.data.map(record => record.id) : null;
  //         } catch (error) {
  //           console.error(`Error fetching data for API ${i}:`, error.message);
  //           return null;
  //         }
  //       })
  //     );
  
  //     const firstApiIds = firstApiResponses.filter(data => data !== null).flat();
  
  //     // Make the second API calls using the IDs obtained from the first API
  //     const axiosInstance = axios.create({
  //       httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  //     });
  
  //     const uniqueDomains = new Set(); // Set to store unique domain URLs
  
  //     await Promise.all(
  //       firstApiIds.map(async (id) => {
  //         try {
  //           const apiUrl = `${secondApiBaseUrl}${id}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //           const response = await axiosInstance.get(apiUrl);
  
  //           // Check if the response is in the expected format
  //           if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].hasOwnProperty('episodes')) {
  //             const domainUrls = response.data[0].episodes.flatMap((episode) =>
  //               episode.sources ? episode.sources.map((source) => extractDomain(source.url) + '.com') : []
  //             );
  
  //             // Filter out duplicates and add unique domain URLs to the set
  //             domainUrls.forEach((url) => uniqueDomains.add(url));
  //           } else {
  //             console.error(`Invalid response format for ID ${id}`);
  //           }
  //         } catch (error) {
  //           console.error(`Error fetching data from the second API for ID ${id}:`, error.message);
  //         }
  //       })
  //     );
  
  //     // Convert set back to array to send as a response
  //     const allUrls = [...uniqueDomains];
  
  //     // Function to fetch trailer URLs from the second API
  //     const fetchTrailerUrls = async () => {
  //       const apiRequests = [];
  //       const trailerUrls = new Set(); // Use a Set to store unique domains
  
  //       for (let i = 0; i <= 3000; i++) {
  //         const apiUrl = `https://admin.dashmoonmx.com/api/movie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //         apiRequests.push(
  //           axios
  //             .get(apiUrl)
  //             .then(response => response.data)
  //             .catch(error => {
  //               console.error(`Error fetching data for API ${i}:`, error.message);
  //               return []; // Return an empty array for failed requests
  //             })
  //         );
  //       }
  
  //       const responses = await Promise.all(apiRequests);
  //       responses.forEach(responseData => {
  //         if (Array.isArray(responseData) && responseData.length > 0) {
  //           // Extract the trailer URLs and add them to the trailerUrls Set
  //           responseData.forEach(item => {
  //             if (item.trailer && item.trailer.url) {
  //               const domainUrl = extractDomain(item.trailer.url);
  //               trailerUrls.add(domainUrl);
  //             }
  //           });
  //         }
  //       });
  
  //       return Array.from(trailerUrls);
  //     };
  
  //     // Fetch trailer URLs from the second API
  //     const trailerUrls = await fetchTrailerUrls();
  
  //     // Merge the unique domains from the first and second API responses
  //     const allUniqueDomains = [...allUrls, ...trailerUrls];
  
  //     response.json(allUniqueDomains);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     response.status(500).send('An error occurred.');
  //   }
  // };
  
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const firstApiUrl = 'https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/';
  //     const secondApiBaseUrl = 'https://moontv.live/api/season/by/serie/';
  
  //     const firstApiResponses = await Promise.all(
  //       Array.from({ length: 1001 }, (_, i) => i).map(async (i) => {
  //         try {
  //           const apiUrl = `${firstApiUrl}${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //           const response = await axios.get(apiUrl);
  //           return Array.isArray(response.data) && response.data.length > 0 ? response.data.map(record => record.id) : null;
  //         } catch (error) {
  //           console.error(`Error fetching data for API ${i}:`, error.message);
  //           return null;
  //         }
  //       })
  //     );
  
  //     const firstApiIds = firstApiResponses.filter(data => data !== null).flat();
  
  //     // Make the second API calls using the IDs obtained from the first API
  //     const axiosInstance = axios.create({
  //       httpsAgent: new https.Agent({ rejectUnauthorized: false }),
  //     });
  
  //     const uniqueDomains = new Set(); // Set to store unique domain URLs
  
  //     const secondApiResponses = await Promise.all(
  //       firstApiIds.map(async (id) => {
  //         try {
  //           const apiUrl = `${secondApiBaseUrl}${id}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //           const response = await axiosInstance.get(apiUrl);
  
  //           // Check if the response is in the expected format
  //           if (Array.isArray(response.data) && response.data.length > 0 && response.data[0].hasOwnProperty('episodes')) {
  //             const domainUrls = response.data[0].episodes.flatMap((episode) =>
  //               episode.sources ? episode.sources.map((source) => extractDomain(source.url) + '.com') : []
  //             );
  
  //             // Filter out duplicates and add unique domain URLs to the set
  //             domainUrls.forEach((url) => uniqueDomains.add(url));
  //           } else {
  //             console.error(`Invalid response format for ID ${id}`);
  //           }
  //         } catch (error) {
  //           console.error(`Error fetching data from the second API for ID ${id}:`, error.message);
  //         }
  //       })
  //     );
  
  //     // Convert set back to array to send as a response
  //     const allUrls = [...uniqueDomains];
  
  //     response.json(allUrls);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     response.status(500).send('An error occurred.');
  //   }
  // };
  
  // Function to extract domain up to top-level domain
  // function extractDomain(url) {
  //   const regex = /^(https?:\/\/(?:[\w-]+\.)*[\w-]+)\.\w+\/.*$/i;
  //   const match = url.match(regex);
  //   return match ? match[1] : url;
  // }

  // get all data but duplicates
  
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const firstApiUrl = 'https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/';
  //     const secondApiBaseUrl = 'https://moontv.live/api/season/by/serie/';
  
  //     const firstApiResponses = await Promise.all(
  //       Array.from({ length: 1001 }, (_, i) => i).map(async (i) => {
  //         try {
  //           const apiUrl = `${firstApiUrl}${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //           const response = await axios.get(apiUrl);
  //           return Array.isArray(response.data) && response.data.length > 0 ? response.data.map(record => record.id) : null;
  //         } catch (error) {
  //           console.error(`Error fetching data for API ${i}:`, error.message);
  //           return null;
  //         }
  //       })
  //     );
  
  //     const firstApiIds = firstApiResponses.filter(data => data !== null).flat();
  
  //     // Make the second API calls using the IDs obtained from the first API
  //     const axiosInstance = axios.create({
  //       httpsAgent: new https.Agent({ rejectUnauthorized: false })
  //     });
  
  //     const secondApiResponses = await Promise.all(
  //       firstApiIds.map(async (id) => {
  //         try {
  //           const apiUrl = `${secondApiBaseUrl}${id}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //           const response = await axiosInstance.get(apiUrl);
  //           return response.data; // Return the data from the second API
  //         } catch (error) {
  //           console.error(`Error fetching data from the second API for ID ${id}:`, error.message);
  //           return null;
  //         }
  //       })
  //     );
  
  //     // Filter out any failed second API calls and return the data
  //     const secondApiData = secondApiResponses.filter(data => data !== null);
  
  //     response.json(secondApiData);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     response.status(500).send('An error occurred.');
  //   }
  // };
  
  // to get only urls
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const apiRequests = [];
  //     const trailerUrls = [];
  
  //     for (let i = 0; i <= 3000; i++) {
  //       const apiUrl = `https://admin.dashmoonmx.com/api/movie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/
  //       `;
  //       apiRequests.push(
  //         axios
  //           .get(apiUrl)
  //           .then(response => response.data)
  //           .catch(error => {
  //             console.error(`Error fetching data for API ${i}:`, error.message);
  //             return []; // Return an empty array for failed requests
  //           })
  //       );
  //     }
  
  //     const responses = await Promise.all(apiRequests);
  //     responses.forEach(responseData => {
  //       if (Array.isArray(responseData) && responseData.length > 0) {
  //         // Extract the trailer URLs and add them to the trailerUrls array
  //         responseData.forEach(item => {
  //           if (item.trailer && item.trailer.url) {
  //             trailerUrls.push(extractDomain(item.trailer.url));
  //           }
  //         });
  //       }
  //     });
  
  //     response.json(trailerUrls);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     response.status(500).send('An error occurred.');
  //   }
  // };
  
  // to get the unique domain for movies
  
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const apiRequests = [];
  //     const trailerUrls = new Set(); // Use a Set to store unique domains
  
  //     for (let i = 0; i <= 3000; i++) {
  //       const apiUrl = `https://admin.dashmoonmx.com/api/movie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //       apiRequests.push(
  //         axios
  //           .get(apiUrl)
  //           .then(response => response.data)
  //           .catch(error => {
  //             console.error(`Error fetching data for API ${i}:`, error.message);
  //             return []; // Return an empty array for failed requests
  //           })
  //       );
  //     }
  
  //     const responses = await Promise.all(apiRequests);
  //     responses.forEach(responseData => {
  //       if (Array.isArray(responseData) && responseData.length > 0) {
  //         // Extract the trailer URLs and add them to the trailerUrls Set
  //         responseData.forEach(item => {
  //           if (item.trailer && item.trailer.url) {
  //             const domainUrl = extractDomain(item.trailer.url);
  //             trailerUrls.add(domainUrl);
  //           }
  //         });
  //       }
  //     });
  
  //     // Convert the Set to an array before sending the response
  //     response.json(Array.from(trailerUrls));
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     response.status(500).send('An error occurred.');
  //   }
  // };
  
  // function extractDomain(url) {
  //   const regex = /^(https?:\/\/(?:[\w-]+\.)*[\w-]+)\.\w+\/.*$/i;
  //   const match = url.match(regex);
  //   return match ? match[1] : url;
  // }
  
  // export const collectDataThroughApi = async (request, response) => {
  //   try {
  //     const apiRequests = [];
  //     const records = [];
  //     let id = 1;
  
  //     for (let i = 0; i <= 3800; i++) {
  //       const apiUrl = `https://admin.dashmoonmx.com/api/role/by/poster/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  //       apiRequests.push(
  //         axios
  //           .get(apiUrl)
  //           .then(response => response.data)
  //           .catch(error => {
  //             // console.error(`Error fetching data for API ${i}:`, error.message);
  //             return {}; // Return an empty object for failed requests
  //           })
  //       );
  //     }
  
  //     const responses = await Promise.all(apiRequests);
  //     const filteredResponses = responses.filter(response => response && Object.keys(response).length !== 0);
  //     const flattenedRecords = filteredResponses.flat();
  //     const extractedRecords = flattenedRecords.map(record => ({
  //       countingnumber: id++,
  //       originalId : record.id,
  //       name: record.name,
  //       biography: record.bio,
  //       poster: record.image,
  //       enable: true,
  //     }));
  
  //     // console.log(extractedRecords);
  //     response.json(extractedRecords);
  //   } catch (error) {
  //     console.error('Error:', error.message);
  //     response.status(500).send('An error occurred.');
  //   }
  // };


  // season and webshow but taking times
  
// export const collectDataThroughApi = async (request, response) => {
//   try {
//     const apiRequests = [];
//     let alldata = [];

//     for (let i = 0; i <= 1000; i++) {
//       const apiUrl = `https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
//       apiRequests.push(
//         axios
//           .get(apiUrl)
//           .then((response) => response.data)
//           .catch((error) => {
//             return []; // Return an empty array for failed requests
//           })
//       );
//     }

//     const responses = await Promise.all(apiRequests);
//     const recordsToInsert = responses
//       .filter(
//         (responseData) => Array.isArray(responseData) && responseData.length > 0
//       )
//       .flat();

//     for (const record of recordsToInsert) {
//       const {
//         id,
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         imdb,
//         comment,
//         downloadas,
//         classification,
//         image,
//         cover,
//         genres,
//         trailer,
//       } = record;

//       // Process the tags using your extractTagsFromGenres function
//       const tags = extractTagsFromGenres(genres);

//       const webSeriesDocument = {
//         seasonId : id,
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         rating: imdb,
//         enable: comment,
//         downloadas,
//         classification,
//         poster: image,
//         banner: cover,
//         tags,
//         trailer: trailer ? trailer.url : null,
//       };

//       // Now you can include the logic from seasonAndData here
//       const seasonApiUrl = `https://admin.dashmoonmx.com/api/season/by/serie/${id}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
//       const seasonApiResponse = await axios
//         .get(seasonApiUrl)
//         .then((response) => response.data)
//         .catch((error) => {
//           console.error("Error fetching season data:", error.message);
//           return {}; // Return an empty object for failed requests
//         });

//         // console.log(seasonApiResponse)

//         alldata = seasonApiResponse;
//     }

//     // Send a response indicating success or further processing
//     response.json({
//       success: true,
//       data: alldata,
//     });
//   } catch (error) {
//     response.status(500).json({
//       success: false,
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// };



// ========================== syn store webshow season episode

// export const seasonAndData = async (webshowId, lastSeasonId , seasonId) => {
//   try {
//     const apiUrl = `https://admin.dashmoonmx.com/api/season/by/serie/${seasonId}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;

//     const apiResponse = await axios.get(apiUrl);

//     const responseData = apiResponse.data[0];

//     const episodesToSave = [];
//     let episodeNumber = 1;
//     const sourceUrl_language_files = new Object();

//     responseData.episodes.forEach((episode) => {

//       episode?.sources[0]?.title !== undefined ?
//       sourceUrl_language_files[
//         episode.sources[0].title ? episode.sources[0].title : "English"
//       ] = episode.sources[0].url
//       :
//       sourceUrl_language_files;
      

//       const episodeDocument = {
//         webshow_id: webshowId, // Replace with actual value
//         season_id: lastSeasonId,
//         episode_number: episodeNumber, // You might need to adjust this
//         title: episode.title ? episode.title : "not readable",
//         description: episode.description,
//         year: 0, // Add year extraction logic here
//         trailer: "",
//         duration: 0, // Add episode duration extraction logic here
//         rating: 0, // Add episode rating extraction logic here
//         poster: episode.image,
//         banner: episode.image,

//         sourceUrl_language_files: sourceUrl_language_files,
//         subtitles_language_files: [],
//         created_at: customeDate, // Replace with actual date
//         updated_at: customeDate, // Replace with actual date
//         enable: true,
//       };

//       episodesToSave.push(episodeDocument);

//       episodeNumber++;
//     });
    

//     // Save each episode to the database
//     for (const episodeDoc of episodesToSave) {
//       const importedEpisode = new episodeSchema(episodeDoc);
//       await importedEpisode.save();
//     }

//     // response.status(200).json({
//     //   success: true,
//     //   message: "Episodes fetched and saved successfully",
//     //   data : episodesToSave,
//     // });
//   } catch (error) {
//     console.error("Error:", error);
//     // response.status(500).json({
//     //   success: false,
//     //   message: "An error occurred",
//     //   error: error.message,
//     // });
//   }
// };






// export const collectDataThroughApi = async (request, response) => {
//   try {
//     const apiRequests = [];

//     for (let i = 0; i <= 1000; i++) {
//       const apiUrl = `https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
//       apiRequests.push(
//         axios
//           .get(apiUrl)
//           .then((response) => response.data)
//           .catch((error) => {
//             return []; // Return an empty array for failed requests
//           })
//       );
//     }

//     const responses = await Promise.all(apiRequests);
//     const recordsToInsert = responses
//       .filter(
//         (responseData) => Array.isArray(responseData) && responseData.length > 0
//       )
//       .flat();

//     for (const record of recordsToInsert) {
//       const {
//         id,
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         imdb,
//         comment,
//         downloadas,
//         classification,
//         image,
//         cover,
//         genres,
//         trailer,
//       } = record;

//       // Process the tags using your extractTagsFromGenres function
//       const tags = extractTagsFromGenres(genres);

//       const webSeriesDocument = {
//         seasonId: id,
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         rating: imdb,
//         enable: comment,
//         downloadas,
//         classification,
//         poster: image,
//         banner: cover,
//         tags,
//         trailer: trailer ? trailer.url : null,
//       };

//       const insertedRecord = await allWebShowRoot.create(webSeriesDocument);

//       const webSeasons = {
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         rating: imdb,
//         enable: comment,
//         downloadas,
//         classification,
//         poster: image,
//         banner: cover,
//         tags,
//         trailer: trailer ? trailer.url : null,
//       };

//       webSeasons.webshow_id = insertedRecord._id;
//       webSeasons.season_number = 1;

      
//       // Insert the same record into another collection with reference to the first collection's _id
//       const recordWithRefId = { ...webSeriesDocument, referenceId: insertedRecord._id };
//       const returnData = await seasonSchema.create(webSeasons);

//       seasonAndData(returnData.webshow_id,returnData._id, id);

//       // process.exit();
//     }
//   } catch (error) {
//     response.status(500).json({
//       success: false,
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// };

// ========================== syn store webshow season episode with actors and selected actors

// export const seasonAndData = async (webshowId, lastSeasonId, seasonId) => {
//   try {
//     const apiUrl = `https://admin.dashmoonmx.com/api/season/by/serie/${seasonId}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;

//     const apiResponse = await axios.get(apiUrl);

//     const responseData = apiResponse.data[0];

//     const episodesToSave = [];
//     let episodeNumber = 1;
//     const sourceUrl_language_files = new Object();

//     responseData.episodes.forEach((episode) => {
//       episode?.sources[0]?.title !== undefined
//         ? (sourceUrl_language_files[
//             episode.sources[0].title ? episode.sources[0].title : "English"
//           ] = episode.sources[0].url)
//         : sourceUrl_language_files;

//       const episodeDocument = {
//         webshow_id: webshowId, // Replace with actual value
//         season_id: lastSeasonId,
//         episode_number: episodeNumber, // You might need to adjust this
//         title: episode.title ? episode.title : "not readable",
//         description: episode.description,
//         year: 0, // Add year extraction logic here
//         trailer: "",
//         duration: 0, // Add episode duration extraction logic here
//         rating: 0, // Add episode rating extraction logic here
//         poster: episode.image,
//         banner: episode.image,

//         sourceUrl_language_files: sourceUrl_language_files,
//         subtitles_language_files: [],
//         created_at: customeDate, // Replace with actual date
//         updated_at: customeDate, // Replace with actual date
//         enable: true,
//       };

//       episodesToSave.push(episodeDocument);

//       episodeNumber++;
//     });

//     // Save each episode to the database
//     for (const episodeDoc of episodesToSave) {
//       const importedEpisode = new episodeSchema(episodeDoc);
//       await importedEpisode.save();
//     }

//     // response.status(200).json({
//     //   success: true,
//     //   message: "Episodes fetched and saved successfully",
//     //   data : episodesToSave,
//     // });
//   } catch (error) {
//     console.error("Error:", error);
//     // response.status(500).json({
//     //   success: false,
//     //   message: "An error occurred",
//     //   error: error.message,
//     // });
//   }
// };

// const addSelectedActor = async (idi, webshowId, upcomingData) => {
//   try {
//     const newActor = new movieSelectedActorsSchema({
//       movieId: webshowId,
//       actors: idi,
//       name: upcomingData.name,
//       poster: upcomingData.poster,
//       born: upcomingData.born,
//       type: "Actor",
//       height: upcomingData.height,
//       biography: upcomingData.biography,
//     });

//     const savedSuccess = await newActor.save();
//     return savedSuccess; // Return the saved actor object or a success indicator
//   } catch (error) {
//     console.error("Error while saving actor:", error);
//   }
// };

// export const actorDetails = async (webshowId, id) => {
//   try {
//     const apiUrl = `https://admin.dashmoonmx.com/api/role/by/poster/${id}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;

//     const apiResponse = await axios.get(apiUrl);
//     const responseDataArray = apiResponse.data; // Assuming this is an array of JSON objects

//     // console.log(responseDataArray);
//     // process.exit();

//     for (const responseData of responseDataArray) {
//       const existingRecord = await actorsSchm.findOne({
//         name: responseData.name,
//       });

//       if (existingRecord) {
//         addSelectedActor(existingRecord._id, webshowId, existingRecord);

//         continue;
//       } else {
//         const upcomingData = new actorsSchm({
//           name: responseData.name,
//           biography: responseData.bio,
//           born: responseData.born,
//           height: responseData.height,
//           poster: responseData.image,
//           enable: true,
//           oldId: id,
//         });

//         // console.log(upcomingData);
//         // process.exit();

//         const savedSuccess = await upcomingData.save();
//         if (savedSuccess) {
//           addSelectedActor(savedSuccess._id, webshowId, upcomingData);
//         }
//       }
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// };

// const updateTvChannelCategories = async (idi, lastId, categoryNames) => {
//   try {
//     const updatedCategories = categoryNames.map((name, index) => ({
//       _id: idi[index],
//       name: name,
//     }));

//     const updatedTvChannel = await allWebShowRoot.findOneAndUpdate(
//       { _id: lastId },
//       { $set: { categories: updatedCategories } },
//       { new: true }
//     );

//     if (!updatedTvChannel) {
//       console.log("TV channel record not found.");
//       return null;
//     }

//     return updatedTvChannel;
//   } catch (error) {
//     console.error("Error while updating TV channel categories:", error);
//     throw error; // Rethrow the error to propagate it
//   }
// };

// const updateOrCreateCategory = async (id, categoryName, lastId) => {
//   try {
//     const existingRecord = await categorySchema.findOne({
//       name: categoryName,
//     });

//     if (existingRecord) {
//       return existingRecord._id;
//     } else {
//       const newCategory = new categorySchema({
//         oldId: id,
//         name: categoryName,
//         type: "WEB SERIES",
//         enable: true,
//         feature: false,
//         position: 0,
//         id: 3,
//       });

//       const savedCategory = await newCategory.save();
//       return savedCategory._id;
//     }
//   } catch (error) {
//     console.error("Error while updating or creating category:", error);
//     throw error;
//   }
// };

// const categories1 = async (lastId, id, categoryNames) => {
//   try {
//     const lastIdStored = [];
//     const idi = [];

//     for (const categoryName of categoryNames) {
//       const categoryId = await updateOrCreateCategory(id, categoryName, lastId);
//       idi.push(categoryId);
//     }

//     if (idi.length > 0) {
//       await updateTvChannelCategories(idi, lastId, categoryNames);
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// };

// export const collectDataThroughApi = async (request, response) => {
//   try {
//     const apiRequests = [];

//     for (let i = 0; i <= 1000; i++) {
//       const apiUrl = `https://admin.dashmoonmx.com/api/serie/by/filtres/0/created/${i}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
//       apiRequests.push(
//         axios
//           .get(apiUrl)
//           .then((response) => response.data)
//           .catch((error) => {
//             return []; // Return an empty array for failed requests
//           })
//       );
//     }

//     const responses = await Promise.all(apiRequests);
//     const recordsToInsert = responses
//       .filter(
//         (responseData) => Array.isArray(responseData) && responseData.length > 0
//       )
//       .flat();

//     for (const record of recordsToInsert) {
//       const {
//         id,
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         imdb,
//         comment,
//         downloadas,
//         classification,
//         image,
//         cover,
//         genres,
//         trailer,
//       } = record;

//       // Process the tags using your extractTagsFromGenres function
//       const tags = extractTagsFromGenres(genres);

//       const webSeriesDocument = {
//         oldId: id,
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         rating: imdb,
//         enable: comment,
//         downloadas,
//         classification,
//         poster: image,
//         banner: cover,
//         tags,
//         trailer: trailer ? trailer.url : null,
//       };

//       const insertedRecord = await allWebShowRoot.create(webSeriesDocument);

//       const webSeasons = {
//         title,
//         label,
//         sublabel,
//         type,
//         description,
//         year,
//         rating: imdb,
//         enable: comment,
//         downloadas,
//         classification,
//         poster: image,
//         banner: cover,
//         tags,
//         trailer: trailer ? trailer.url : null,
//       };

//       webSeasons.webshow_id = insertedRecord._id;
//       webSeasons.season_number = 1;

//       // Insert the same record into another collection with reference to the first collection's _id
//       const recordWithRefId = {
//         ...webSeriesDocument,
//         referenceId: insertedRecord._id,
//       };
//       const returnData = await seasonSchema.create(webSeasons);

//       seasonAndData(returnData.webshow_id, returnData._id, id);
//       actorDetails(insertedRecord._id, id);
//       categories1(insertedRecord._id, id, tags);

//       // process.exit();
//     }
//   } catch (error) {
//     response.status(500).json({
//       success: false,
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// };


// ============================================= tv channel with categories


// const updateTvChannelCategories = async (idi, lastId, categoryNames) => {
//   try {
//     const updatedCategories = categoryNames.map((name, index) => ({
//       _id: idi[index],
//       name: name,
//     }));

//     const updatedTvChannel = await tvChannelSchm.findOneAndUpdate(
//       { _id: lastId },
//       { $set: { categories: updatedCategories } },
//       { new: true }
//     );

//     if (!updatedTvChannel) {
//       console.log("TV channel record not found.");
//       return null;
//     }

//     return updatedTvChannel;
//   } catch (error) {
//     console.error("Error while updating TV channel categories:", error);
//     throw error; // Rethrow the error to propagate it
//   }
// };

// const updateOrCreateCategory = async (id, categoryName, lastId) => {
//   try {
//     const existingRecord = await categorySchema.findOne({
//       name: categoryName,
//     });

//     if (existingRecord) {
//       return existingRecord._id;
//     } else {
//       const newCategory = new categorySchema({
//         oldId: id,
//         name: categoryName,
//         type: "TV CHANNEL",
//         enable: true,
//         feature: false,
//         position: 0,
//         id: 1,
//       });

//       const savedCategory = await newCategory.save();
//       return savedCategory._id;
//     }
//   } catch (error) {
//     console.error("Error while updating or creating category:", error);
//     throw error;
//   }
// };

// const categories1 = async (lastId, id, categoryNames) => {
//   try {
//     const lastIdStored = [];
//     const idi = [];

//     for (const categoryName of categoryNames) {
//       const categoryId = await updateOrCreateCategory(id, categoryName, lastId);
//       idi.push(categoryId);
//     }

//     if (idi.length > 0) {
//       await updateTvChannelCategories(idi, lastId, categoryNames);
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// };



// export const collectDataThroughApi = async (request, response) => {
//   try {
//     const apiUrl = `https://admin.dashmoonmx.com/api/first/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;

//     const apiResponse = await axios.get(apiUrl);

//     const responseData = apiResponse.data.channels;

    

//     for (const record of responseData) {
//       const {
//         id,
//         title,
//         label,
//         sublabel,
//         description,
//         website,
//         classification,
//         views,
//         shares,
//         rating,
//         playas,
//         comment,
//         image,
//         sources,
//         categories,
//       } = record;

//       // Extract the source URLs directly
//       const source_url = sources.map((source) => source.url);

      
//       const category = extractTagsFromGenres(categories);

//       const combinedSourceUrl = source_url.join(', ');

      

//       const tvChannelDocument = {
//         oldId: id,
//         name: title,
//         source_url : combinedSourceUrl,
//         rating : rating,
//         enable: true,
//         poster: image,
//         banner: image,
//       };
      
//       const insertedRecord = await tvChannelSchm.create(tvChannelDocument);
//       categories1(insertedRecord._id, id, category);

//       // process.exit();
//     }
//   } catch (error) {
//     response.status(500).json({
//       success: false,
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// };


// ===========================movies / categories / actors =========================

// const updateTvChannelCategories = async (idi, lastId, categoryNames) => {
//   try {
//     const updatedCategories = categoryNames.map((name, index) => ({
//       _id: idi[index],
//       name: name,
//     }));

//     const updatedTvChannel = await movieSchm.findOneAndUpdate(
//       { _id: lastId },
//       { $set: { categories: updatedCategories } },
//       { new: true }
//     );

//     if (!updatedTvChannel) {
//       console.log("TV channel record not found.");
//       return null;
//     }

//     return updatedTvChannel;
//   } catch (error) {
//     console.error("Error while updating TV channel categories:", error);
//     throw error; // Rethrow the error to propagate it
//   }
// };

// const updateOrCreateCategory = async (id, categoryName, lastId) => {
//   try {
//     const existingRecord = await categorySchema.findOne({
//       name: categoryName,
//     });

//     if (existingRecord) {
//       return existingRecord._id;
//     } else {
//       const newCategory = new categorySchema({
//         oldId: id,
//         name: categoryName,
//         type: "MOVIES",
//         enable: true,
//         feature: false,
//         position: 0,
//         id: 2,
//       });

//       const savedCategory = await newCategory.save();
//       return savedCategory._id;
//     }
//   } catch (error) {
//     console.error("Error while updating or creating category:", error);
//     throw error;
//   }
// };

// const categories1 = async (lastId, id, categoryNames) => {
//   try {
//     const lastIdStored = [];
//     const idi = [];

//     for (const categoryName of categoryNames) {
//       const categoryId = await updateOrCreateCategory(id, categoryName, lastId);
//       idi.push(categoryId);
//     }

//     if (idi.length > 0) {
//       await updateTvChannelCategories(idi, lastId, categoryNames);
//     }
//   } catch (error) {
//     console.error("Error:", error.message);
//   }
// };

// const addSelectedActor = async (idi, webshowId, upcomingData) => {
//     try {
//       const newActor = new movieSelectedActorsSchema({
//         movieId: webshowId,
//         actors: idi,
//         name: upcomingData.name,
//         poster: upcomingData.poster,
//         born: upcomingData.born,
//         type: "Actor",
//         height: upcomingData.height,
//         biography: upcomingData.biography,
//       });
  
//       const savedSuccess = await newActor.save();
//       return savedSuccess; // Return the saved actor object or a success indicator
//     } catch (error) {
//       console.error("Error while saving actor:", error);
//     }
//   };

// export const actorDetails = async (webshowId, id) => {
//     try {
//       const apiUrl = `https://admin.dashmoonmx.com/api/role/by/poster/${id}/4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/`;
  
//       const apiResponse = await axios.get(apiUrl);
//       const responseDataArray = apiResponse.data; // Assuming this is an array of JSON objects
  
//       // console.log(responseDataArray);
//       // process.exit();
  
//       for (const responseData of responseDataArray) {
//         const existingRecord = await actorsSchm.findOne({
//           name: responseData.name,
//         });
  
//         if (existingRecord) {
//           addSelectedActor(existingRecord._id, webshowId, existingRecord);
  
//           continue;
//         } else {
//           const upcomingData = new actorsSchm({
//             name: responseData.name,
//             biography: responseData.bio,
//             born: responseData.born,
//             height: responseData.height,
//             poster: responseData.image,
//             enable: true,
//             oldId: id,
//           });
  
//           // console.log(upcomingData);
//           // process.exit();
  
//           const savedSuccess = await upcomingData.save();
//           if (savedSuccess) {
//             addSelectedActor(savedSuccess._id, webshowId, upcomingData);
//           }
//         }
//       }
//     } catch (error) {
//       console.error("Error:", error.message);
//     }
//   };

// export const collectDataThroughApi = async (request, response) => {
//   try {
//     const baseURL = "https://admin.dashmoonmx.com/api/movie/by/filtres/";
//     const apiKey =
//       "4F5A9C3D9A86FA54EACEDDD635185/4F5A9C3D9A86FA54EACEDDD635185/";
//     const maxIterations = 1000;

//     for (let i = 0; i < maxIterations; i++) {
//       const apiUrl = `${baseURL}0/created/${i}/${apiKey}`;

//       const apiResponse = await axios.get(apiUrl);

//       const responseData = apiResponse.data;

//       for (const record of responseData) {
//         const {
//           id,
//           type,
//           title,
//           label,
//           sublabel,
//           description,
//           year,
//           imdb,
//           comment,
//           rating,
//           duration,
//           downloadas,
//           playas,
//           image,
//           cover,
//           genres,
//           trailer,
//           sources,
//         } = record;

//         // Extract the source URLs directly
//         const source_url = sources.map((source) => source.url);

//         const category = extractTagsFromGenres(genres);

//         const sourceUrl_language_files = convertTrailerFormat(source_url);

//         // console.log(sourceUrl_language_files);
//         // process.exit();

//         const moviesDocument = {
//           oldId: id,
//           title: title,
//           sourceUrl_language_files: sourceUrl_language_files,
//           rating: rating,
//           enable_comments: true,
//           poster: image,
//           banner: cover,
//           label: label,
//           sublabel: sublabel,
//           type: "movie",
//           description: description,
//           year: year,
//           rating: imdb ? imdb : 0,
//           downloadas: downloadas,
//           categories: [],
//           duration: 0,
//           subtitles_language_files: [],
//           classification: null,
//           tags: extractTagsFromGenres(genres),
//           trailer: trailer?.url,
//         };

//         const insertedRecord = await movieSchm.create(moviesDocument);
//         categories1(insertedRecord._id, id, category);
//         actorDetails(insertedRecord._id, id);

//         // process.exit();
//       }
//     }
//     response.json({ success: true, message: "Data collection completed." });
//   } catch (error) {
//     response.status(500).json({
//       success: false,
//       message: "An error occurred",
//       error: error.message,
//     });
//   }
// };