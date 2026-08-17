// REGISTER
function registerUser(){
 let data = {
   name:document.getElementById("name").value,
   email:document.getElementById("email").value,
   password:document.getElementById("password").value,
   role:document.getElementById("role").value
 };
 fetch("http://localhost:3000/auth/register",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(data)
 }).then(()=>alert("Registered!")).then(()=>location.href="login.html");
}

// LOGIN
function loginUser(){
 let data = {
   email:document.getElementById("email").value,
   password:document.getElementById("password").value
 };
 fetch("http://localhost:3000/auth/login",{
   method:"POST",
   headers:{'Content-Type':'application/json'},
   body:JSON.stringify(data)
 }).then(r=>r.json()).then(d=>{
   localStorage.setItem("token",d.token);
   if(d.role=="student") location.href="student/dashboard.html";
   else location.href="institute/dashboard.html";
 });
}

// STUDENT DASHBOARD
function loadExams(){
 fetch("http://localhost:3000/exam",{
   headers:{authorization:localStorage.getItem("token")}
 }).then(r=>r.json()).then(data=>{
   examList.innerHTML = data.map(e=>`
    <div class="card">
     <p>${e.title} (ID: ${e.id})</p>
     <button onclick="startExam(${e.id})">Start</button>
    </div>
   `).join("");
 });
}

// INSTITUTE DASHBOARD
function loadMyExams(){
 fetch("http://localhost:3000/exam/mine",{
   headers:{authorization:localStorage.getItem("token")}
 }).then(r=>r.json()).then(data=>{
   myExams.innerHTML = data.map(e=>`
    <div class="card">
      <p>${e.title} (ID: ${e.id})</p>
    </div>
   `).join("");
 });
}

function createExam(){
 let data = {
   title:document.getElementById("examTitle").value,
   duration:parseInt(document.getElementById("examDuration").value)
 };
 fetch("http://localhost:3000/exam/create",{
   method:"POST",
   headers:{
     'Content-Type':'application/json',
     'authorization':localStorage.getItem("token")
   },
   body:JSON.stringify(data)
 }).then(()=>alert("Exam Created")).then(()=>loadMyExams());
}

// EXAM PAGE
let examTimer;
function startExam(){
 let examId = parseInt(localStorage.getItem("currentExamId"));
 fetch(`http://localhost:3000/exam/${examId}`,{
   headers:{authorization:localStorage.getItem("token")}
 }).then(r=>r.json()).then(exam=>{
   let questionsDiv = document.getElementById("questions");
   exam.forEach((q,i)=>{
     questionsDiv.innerHTML += `
       <div class="card">
         <p>${i+1}. ${q.question}</p>
         <label><input type="radio" name="q${i}" value="0">${q.option1}</label><br>
         <label><input type="radio" name="q${i}" value="1">${q.option2}</label><br>
         <label><input type="radio" name="q${i}" value="2">${q.option3}</label><br>
         <label><input type="radio" name="q${i}" value="3">${q.option4}</label><br>
       </div>`;
   });
   let time = 5*60;
   examTimer = setInterval(()=>{
     time--;
     timer.innerText = `Time Left: ${time}s`;
     if(time<=0) submitExam(examId);
   },1000);
 });
}

function submitExam(examId){
 clearInterval(examTimer);
 let answers = [];
 let examCards = document.querySelectorAll("#questions .card");
 examCards.forEach((card,i)=>{
   let sel = card.querySelector(`input[name=q${i}]:checked`);
   answers.push({selected:sel?parseInt(sel.value):-1, correct:0});
 });
 fetch("http://localhost:3000/exam/submit",{
   method:"POST",
   headers:{
     'Content-Type':'application/json',
     'authorization':localStorage.getItem("token")
   },
   body:JSON.stringify({exam_id:examId, answers})
 }).then(r=>r.json()).then(d=>{
   localStorage.setItem("lastScore",d.score);
   location.href="result.html";
 });
}

function displayResult(){
 score.innerText = `Score: ${localStorage.getItem("lastScore")}`;
}

document.getElementById("registerBtn").addEventListener("click", registerUser);
document.getElementById("loginBtn").addEventListener("click", loginUser);
let exam = JSON.parse(localStorage.getItem("activeExam"));
let index = 0;
let answers = {};
let timeLeft = exam.duration * 60;

function loadQuestion(){
  let q = exam.questions[index];
  questionBox.innerHTML = `Q${index+1}. ${q.question}`;
  ["A","B","C","D"].forEach((o,i)=>{
    document.getElementById(o).innerText = q.options[i];
  });
}

function selectOption(opt){
  answers[index] = opt;
}


function next(){ if(index < exam.questions.length-1){ index++; loadQuestion(); } }
function prev(){ if(index > 0){ index--; loadQuestion(); } }

function submitExam(){
  localStorage.setItem("answers", JSON.stringify(answers));
  location.href="result.html";
}

setInterval(()=>{
  timeLeft--;
  timer.innerText = `Time Left: ${Math.floor(timeLeft/60)}:${timeLeft%60}`;
  if(timeLeft<=0) submitExam();
},1000);

loadQuestion();

function submitExam(){
  let currentUser = JSON.parse(localStorage.getItem("currentUser"));
  let results = JSON.parse(localStorage.getItem("results") || "[]");

  let score = 0;
  let subjectAnalysis = {};

  exam.questions.forEach((q,i)=>{
    if(!subjectAnalysis[q.subject]){
      subjectAnalysis[q.subject]={correct:0,total:0};
    }
    subjectAnalysis[q.subject].total++;
    if(answers[i] === q.answer){
      score++;
      subjectAnalysis[q.subject].correct++;
    }
  });

  let result = {
    examId: exam.id,
    examTitle: exam.title,
    studentEmail: currentUser.email,
    instituteEmail: exam.instituteEmail,
    score: score,
    total: exam.questions.length,
    percentage: ((score/exam.questions.length)*100).toFixed(2),
    subjectAnalysis: subjectAnalysis,
    submittedAt: new Date().toLocaleString()
  };

  results.push(result);
  localStorage.setItem("results", JSON.stringify(results));

  location.href = "result.html";
}

<p><b>Status:</b> <span>${myResult ? "Attempted" : "Not Attempted"}</span></p>

