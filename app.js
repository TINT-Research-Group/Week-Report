const { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_FUNCTION_URL } = window.APP_CONFIG;
const supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const form = document.getElementById("report-form");
const messageEl = document.getElementById("message");
const reportListEl = document.getElementById("report-list");

function getThisWeekMonday() {
  const now = new Date();
  const day = now.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;

  const monday = new Date(now);
  monday.setUTCDate(now.getUTCDate() + diff);
  monday.setUTCHours(0, 0, 0, 0);

  return monday.toISOString().slice(0, 10);
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text ?? "";
  return div.innerHTML;
}

async function loadReports() {
  const weekStart = getThisWeekMonday();

  const { data, error } = await supabaseClient
    .from("weekly_reports")
    .select("member_name, report, created_at, updated_at, week_start")
    .eq("week_start", weekStart)
    .order("member_name", { ascending: true });

  if (error) {
    reportListEl.innerHTML = `<p>Failed to load reports: ${escapeHtml(error.message)}</p>`;
    return;
  }

  if (!data || data.length === 0) {
    reportListEl.innerHTML = "<p>No reports yet this week.</p>";
    return;
  }

  reportListEl.innerHTML = data.map(item => `
    <div class="report-item">
      <h3>${escapeHtml(item.member_name)}</h3>
      <p><strong>Week:</strong> ${escapeHtml(item.week_start)}</p>
      <p>${escapeHtml(item.report).replace(/\n/g, "<br>")}</p>
    </div>
  `).join("");
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  messageEl.textContent = "Submitting...";

  const name = document.getElementById("name").value.trim();
  const password = document.getElementById("password").value;
  const report = document.getElementById("report").value.trim();

  if (!name || !password || !report) {
    messageEl.textContent = "Please fill in all fields.";
    return;
  }

  try {
    const res = await fetch(SUPABASE_FUNCTION_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SUPABASE_ANON_KEY,
        "Authorization": `Bearer ${SUPABASE_ANON_KEY}`
      },
      body: JSON.stringify({ name, password, report })
    });

    let result = {};
    try {
      result = await res.json();
    } catch (_) {
      result = {};
    }

    if (!res.ok) {
      messageEl.textContent = result.error || "Submit failed";
      return;
    }

    messageEl.textContent = "Submit success";
    form.reset();
    await loadReports();
  } catch (err) {
    messageEl.textContent = err.message || "Unknown error";
  }
});

loadReports();
