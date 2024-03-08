const main = document.getElementById("main");
const loader = document.getElementById("wrapper");
const year_container = document.querySelector(".year_container");

loader.classList.remove("loading_hidden");

function fetchData() {
  const urlParams = new URLSearchParams(window.location.search);

  const universityName = urlParams.get("university");
  return fetch(
    `https://apdegreepapers.in/api/v1/university/getlocaldata?university=${universityName}`
  )
    .then((response) => {
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      return response.json();
    })
    .catch((error) => {
      console.error("There was a problem fetching the data:", error);

      return false;
    });
}
// Call the function and store the returned data
fetchData().then((res) => {
  app(res.data);
});

function app(universityData) {
  loader.classList.add("loading_hidden");

  if (universityData) {
    universityData.years.forEach((year) => {
      const div = document.createElement("div");
      div.classList.add("year_selct");
      div.textContent = year.year;
      div.setAttribute("data-year", year.year);
      year_container.appendChild(div);
    });
    const years = document.querySelectorAll(".year_selct");
    years.forEach((year) =>
      year.addEventListener("click", function () {
        const year_container = document.getElementById("year");
        const active_year = year_container.getElementsByClassName("active");
        if (active_year.length) {
          active_year[0].className = active_year[0].className.replace(
            " active",
            ""
          );
        }
        this.className += " active";

        // render the sems buttons
        // check the if sem and table existing if exists remove it
        const sem = document.getElementById("sem");
        if (sem) main.removeChild(sem);
        const table = document.getElementById("table_section");
        if (table) main.removeChild(table);

        // start loader
        loader.classList.remove("loading_hidden");

        const year_data = universityData.years.find(
          (dt) => dt.year == year.getAttribute("data-year")
        );

        const dom_sem_container = document.createElement("section");
        dom_sem_container.classList.add("sem");
        dom_sem_container.setAttribute("id", "sem");
        const h2 = document.createElement("h2");
        const div = document.createElement("div");
        div.classList.add("sem_container");
        h2.textContent = "Select The Sem:";
        dom_sem_container.appendChild(h2);
        dom_sem_container.appendChild(div);
        main.appendChild(dom_sem_container);
        const sem_container = document.querySelector(".sem_container");

        year_data.semesters.forEach((sem) => {
          const div = document.createElement("div");
          div.classList.add("sem_select");
          div.textContent = sem.semName;
          div.setAttribute("data-sem", sem.semName);
          sem_container.appendChild(div);
        });

        //trigering scroll
        document.getElementById("sem").scrollIntoView({ behavior: "smooth" });
        // loader stop
        setTimeout(() => {
          loader.classList.add("loading_hidden");
        }, 200);

        const sems = document.querySelectorAll(".sem_select");
        sems.forEach((sem) => {
          sem.addEventListener("click", function () {
            const sem_container = document.getElementById("sem");

            const active_sem = sem_container.getElementsByClassName("active");
            if (active_sem.length)
              active_sem[0].className = active_year[0].className.replace(
                " active",
                ""
              );
            this.className += " active";

            // render table
            // check the if table existing if exists remove it
            const table = document.getElementById("table_section");
            if (table) main.removeChild(table);

            // start loader
            loader.classList.remove("loading_hidden");

            const dom_table_container = document.createElement("section");
            dom_table_container.classList.add("table_section");
            dom_table_container.setAttribute("id", "table_section");
            const h2 = document.createElement("h2");
            h2.textContent = `${universityData.name} ${
              year_data.year
            } year ${sem.getAttribute("data-sem")} questions papers.`;
            dom_table_container.appendChild(h2);
            const table_container = document.createElement("table");
            table_container.classList.add("iftable");
            const tr = document.createElement("tr");
            const th = document.createElement("th");
            const th2 = document.createElement("th");
            th.textContent = "Questions papers";
            th2.textContent = "Download";
            tr.appendChild(th);
            tr.appendChild(th2);
            table_container.appendChild(tr);
            dom_table_container.appendChild(table_container);
            main.appendChild(dom_table_container);

            //render table paper data

            const sem_data = year_data.semesters.find(
              (dt) => dt.semName === sem.getAttribute("data-sem")
            );

            sem_data.subjects.forEach((sub) => {
              sub.papers.forEach((pap) => {
                const tr = document.createElement("tr");
                const td = document.createElement("td");
                const tda = document.createElement("td");
                const a = document.createElement("a");
                const span = document.createElement("span");
                span.classList.add("subject_name");
                span.textContent = `${pap.subjectName}`;
                td.appendChild(span);
                td.innerHTML += ` : ${pap.paperTitle}`;
                // td.textContent += ` ${pap.paperTitle}`;
                a.textContent = "Download";
                a.setAttribute("href", `${pap.pdfFileURL}`);
                tda.appendChild(a);
                tr.appendChild(td);
                tr.appendChild(tda);
                table_container.appendChild(tr);
              });
            });
            //trigering scroll
            document
              .getElementById("table_section")
              .scrollIntoView({ behavior: "smooth" });

            // loader stop
            setTimeout(() => {
              loader.classList.add("loading_hidden");
            }, 200);
          });
        });
      })
    );
  } else {
    const noData = document.createElement("p");
    noData.textContent = "No Data Found For This University.";
    noData.classList.add("no_data_found");
    year_container.appendChild(noData);
  }
}

// update url based on selected university

const select_university = document.getElementById("select_university");

select_university.addEventListener("change", function () {
  const selected_url = select_university.value;
  if (selected_url) {
    window.location.href = selected_url;
  } else {
    alert("please select university");
  }
});

//scroll to top
function scrollFunction() {
  const scrollBtn = document.getElementById("scroll_to_top");
  if (document.body.scrollTop > 20 || document.documentElement.scrollTop > 20) {
    scrollBtn.style.display = "flex";
  } else {
    scrollBtn.style.display = "none";
  }
}
function scrollToTop() {
  document.body.scrollTop = 0; // For Safari
  document.documentElement.scrollTop = 0; // For Chrome, Firefox, IE and Opera
}

window.onscroll = function () {
  scrollFunction();
};
