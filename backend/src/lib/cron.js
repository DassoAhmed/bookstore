import cron from "cron";
import https from "https";

const job = new cron.CronJob("*/14 * * * *", function () {
    https
    .get(process.env.API_URL, (res) => {
        if (res.statusCode === 200) {
            console.log("Cron job executed successfully");
        } else {
            console.error(`Cron job failed with status code: ${res.statusCode}`);
        }
    }).on("error", (err) => {
        console.error("Error executing cron job:", err);

    });
});

export default job;

//CRON JOB EXPLANATION
// This cron job runs every 14 minutes and makes a GET request to the specified URL.
// If the request is successful (status code 200), it logs a success message.
// If the request fails, it logs an error message with the status code.
// The job is set up using the cron package, which allows scheduling tasks in Node.js.
// To start the cron job, you need to call job.start() in your main application file.
// Make sure to handle the job's lifecycle appropriately, such as starting and stopping it as needed.


//HOW TO DEFINE A SCHEDULE
// Cron syntax: * * * * *   
// ┬ ┬ ┬ ┬ ┬
// │ │ │ │ │    
// │ │ │ │ └───── Day of the week (0 - 7) (Sunday is both 0 and 7)
// │ │ │ └────────── Month (1 - 12)
// │ │ └────────────── Day of the month (1 - 31)
// │ └───────────────── Hour (0 - 23)
// └─────────────────── Minute (0 - 59)
// The cron syntax consists of five fields separated by spaces, representing minute, hour, day of month, month, and day of week.
// For example, "*/14 * * * *" means every 14 minutes.
// To use this cron job, you need to install the cron package:
// npm install cron

// EXAMPLES && EXPLANATION:
// "0 0 * * *" - At 00:00 (midnight) every day
// "0 12 * * *" - At 12:00 (noon) every day
// "0 0 * * 0" - At 00:00 (midnight) every Sunday
// "0 0 1 * *" - At 00:00 (midnight) on the first day of every month
// "*/5 * * * *" - Every 5 minutes
// "0 9 * * 1-5" - At 09:00 (9 AM) every weekday (Monday to Friday)
// "0 0 * * *" - At 00:00 (midnight) every day
// "0 0 * * 1" - At 00:00 (midnight) every Monday
// "0 0 1 * *" - At 00:00 (midnight) on the first day of every month
// "0 0 * * 1-5" - At 00:00 (midnight) every weekday (Monday to Friday)
// "*/14 * * * *" - Every 14 minutes

