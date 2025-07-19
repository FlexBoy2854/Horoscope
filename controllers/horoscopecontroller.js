const sqlite3 = require('sqlite3');
const { open } = require('sqlite');

// 👇 DEFINE THE DATABASE PATH HERE
const DB_PATH = process.env.DATABASE_PATH || './horoscope.db';

// ... (solutionsByMonth and spiritualByMonth data stays the same)
const solutionsByMonth = {
    1: ["💰 Success in business ventures", "💑 Stable relationships", "🪙 Avoid unnecessary risks"],
    2: ["💘 Love rekindled", "📚 Time for learning", "🧿 Protect your aura"],
    3: ["📈 Big growth in career", "🎨 Creativity boost", "🙏 Embrace meditation"],
    4: ["🏠 Property gains", "💼 Smooth business operations", "🕉 Ganesha blessings"],
    5: ["💑 New romantic paths", "💰 Curb impulsive spending", "🔮 Trust divine timing"],
    6: ["💍 Marriage luck", "🧘 Peaceful resolution to past issues", "🪷 Venus energy rising"],
    7: ["📚 Enlightenment period", "🛡 Protection from betrayal", "🔥 Light a lamp daily"],
    8: ["🧿 Remove negativity", "💼 Powerful career moves", "🔱 Saturn balancing rituals"],
    9: ["💖 Family strength", "🌱 New spiritual awakening", "🪔 Ancestor blessings"],
    10: ["🏆 Life success increases", "💰 Financial clarity", "🌺 Goddess Laxmi energy"],
    11: ["🌙 Strong emotional balance", "📿 Mantra chanting helps", "🛕 Temple visits advised"],
    12: ["🎯 Long-term clarity", "💼 Great month for risk-taking", "🧿 Stay grounded"]
};

const spiritualByMonth = {
    1: "January born souls are natural leaders. Embrace your path.",
    2: "Your aura is emotional but wise. Follow your heart's rhythm.",
    3: "March brings rebirth. This is your season of change.",
    4: "You're driven by fire. Channel it for creation, not conflict.",
    5: "Taurus season offers healing. Let go of old fears.",
    6: "Gemini minds are fast — stay centered to grow spiritually.",
    7: "Cancer brings ancestral ties. Honor your roots.",
    8: "Leo energy surrounds you. Own your destiny with grace.",
    9: "You're a fixer of broken things. Start with yourself.",
    10: "Your fairness will be rewarded. Justice aligns with you.",
    11: "Scorpio rebirth energy flows through you. You are transformation.",
    12: "Sagittarius opens your third eye. Trust what you feel."
};

/**
 * @desc Renders the main form page
 * @route GET /
 */
exports.renderForm = (req, res) => {
    res.render('index', { title: 'KINNER GURU MAA - Horoscope Guide' });
};

/**
 * @desc Processes form data, saves it, and renders the results page
 * @route POST /submit
 */
exports.getPrediction = async (req, res) => {
    const { name, birthdate, location } = req.body;

    try {
        const db = await open({
            filename: DB_PATH, // 👈 USE THE DB_PATH VARIABLE
            driver: sqlite3.Database
        });

        await db.run(
            'INSERT INTO submissions (name, birthdate, location) VALUES (?, ?, ?)',
            [name, birthdate, location]
        );

        await db.close();
    } catch (err) {
        console.error('Database error:', err);
    }


    let month = null;
    if (birthdate && birthdate.includes("-")) {
        month = parseInt(birthdate.split("-")[1], 10);
    }

    const solutions = solutionsByMonth[month] || ["🌟 Please provide a valid birth date to receive your divine guidance."];
    const spiritualMessage = spiritualByMonth[month] || "✨ The universe supports you. Listen closely to its signs.";

    res.render('result', {
        title: 'Your Divine Reading',
        name: name || "Not provided",
        birthdate: birthdate || "Not provided",
        location: location || "Not provided",
        solutions: solutions,
        spiritualMessage: spiritualMessage
    });
};

/**
 * @desc Displays all submissions from the database
 * @route GET /submissions
 */
exports.viewSubmissions = async (req, res) => {
    try {
        const db = await open({
            filename: DB_PATH, // 👈 USE THE DB_PATH VARIABLE
            driver: sqlite3.Database
        });

        const submissions = await db.all('SELECT * FROM submissions ORDER BY timestamp DESC');
        await db.close();

        res.render('submissions', { title: 'View Submissions', submissions });

    } catch (err) {
        console.error('Database error:', err);
        res.status(500).send("Error retrieving data from database.");
    }
};