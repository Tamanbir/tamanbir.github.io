/*
  Interactive resume terminal script for Tamanbir Singh.

  The terminal supports a variety of commands to explore resume
  information and provides a fun, shell‑like experience. Users can
  navigate through directories, view file contents, check the current
  date/time and view command history. External profile links open in
  new tabs. A simple banner command adds a playful touch.
*/

document.addEventListener('DOMContentLoaded', () => {
  const outputDiv = document.querySelector('.terminal-output');
  const commandInput = document.querySelector('.command-input');
  const terminalBody = document.querySelector('.terminal-body');

  // Update year in footer
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Command history storage
  const commandHistory = [];
  let historyIndex = -1;

  // Virtual file system state
  let currentDirectory = '/';
  const fileContents = {
    '/about/about.txt':
      'Experienced Java developer with a strong background in microservices architecture, Java/J2EE and secure application development. Skilled in the full software development lifecycle (SDLC), from requirements gathering to deployment, with proven expertise in REST/gRPC APIs, cloud platforms (AWS, Azure) and application security scanning. Adept at working in Agile environments, integrating CI/CD pipelines and delivering high‑quality, scalable and secure solutions for enterprise systems.',
    '/certifications/certifications.txt':
      '1. AWS Certified Cloud Practitioner\n2. Certified Ethical Hacker v9 – EC‑Council\n3. Machine Learning & Deep Learning – Hewlett Packard Enterprise',
    '/experience/experience.txt':
      '1. Java Developer @ Commerce Dynamics (May 2022 – Present)\n\n' +
      '• Design, develop and maintain microservices‑based enterprise applications using Java/J2EE, Spring Boot and RESTful APIs; integrate with external systems via JSON and gRPC.\n' +
      '• Implement CI/CD pipelines using Jenkins, Maven and Gradle; streamline deployment to AWS and Azure environments via Dockerised builds.\n' +
      '• Conduct application security scans with SonarQube, Fortify and Black Duck, ensuring code compliance with OWASP standards.\n' +
      '• Collaborate in an Agile setting, actively participating in sprint planning, grooming and retrospectives while adhering to structured SDLC processes.\n' +
      '• Work extensively with RDBMS/SQL (MSSQL, PostgreSQL) for database design, query optimisation and stored procedure development.\n' +
      '• Integrate OAuth and Okta for secure single sign‑on (SSO) functionality.\n' +
      '• Use Postman for API testing and JUnit for automated unit and integration testing, improving test coverage by 30 percent.\n\n' +
      '2. Software Experience Labs Student (Intern) @ BlackBerry (Jan 2022 – Apr 2022)\n\n' +
      '• Assisted in microservices and REST API validation for enterprise security products.\n' +
      '• Developed automation scripts in PowerShell to streamline Active Directory user/group management and environment setup.\n' +
      '• Worked with SIEM tools (Cylance, XmCyber, Splunk, QRadar) to monitor and investigate potential security threats.\n' +
      '• Deployed and tested software in Docker containers for cross‑platform compatibility checks.\n' +
      '• Participated in application vulnerability scanning using Fortify and SonarQube, reporting and remediating findings according to security best practices.\n\n' +
      '3. Freelancer – Security Analyst (Jun 2016 – Aug 2020)\n\n' +
      '• Delivered vulnerability assessment and penetration testing (VAPT) services for web, mobile and network systems.\n' +
      '• Designed and implemented secure architecture recommendations for applications using Java, Spring and microservices patterns.\n' +
      '• Provided compliance solutions for HIPAA and PCI DSS, ensuring systems met regulatory requirements.\n' +
      '• Created automated security scripts in Python for scanning REST endpoints and generating JSON‑based vulnerability reports.\n' +
      '• Integrated findings into client SDLC pipelines, improving security posture before production releases.',
    '/education/education.txt':
      '1. Lambton College, Toronto, ON – Cloud Computing for Big Data (Post‑Graduate Diploma) – Sep 2020 – Apr 2022. GPA: 3.5/4.0\n\n' +
      '2. Guru Nanak Dev University, Punjab, India – Master of Computer Applications – Dec 2019. CGPA: 7.22/10',
    '/skills/skills.txt':
      'Languages: Java, Python, JavaScript, HTML/CSS\n' +
      'Frameworks: Spring Boot, JSP, Servlets, Django\n' +
      'APIs: REST, gRPC, JSON\n' +
      'Testing: JUnit, Postman, Swagger, curl\n' +
      'Build Tools: Maven, Gradle\n' +
      'Databases: MySQL, MSSQL, PostgreSQL\n' +
      'Cloud: AWS, Azure\n' +
      'DevOps: Jenkins, Docker, Git, SVN, CI/CD\n' +
      'Security Tools: SonarQube, Fortify, Black Duck, Acunetix, Burp Suite, OWASP ZAP, Wireshark, Nessus, Nmap, Metasploit\n' +
      'Agile/SDLC: Scrum, Kanban, Secure Coding Practices'
  };

  // Quotes and jokes for fun commands
  const quotes = [
    '“Code is like humor. When you have to explain it, it’s bad.” – Cory House',
    '“Fix the cause, not the symptom.” – Steve Maguire',
    '“Deleted code is debugged code.” – Jeff Sickel',
    '“Simplicity is the soul of efficiency.” – Austin Freeman',
    '“Experience is the name everyone gives to their mistakes.” – Oscar Wilde',
    '“Before software can be reusable it first has to be usable.” – Ralph Johnson',
    '“Programming isn’t about what you know; it’s about what you can figure out.” – Chris Pine'
  ];

  const jokes = [
    'Why do programmers prefer dark mode? Because light attracts bugs!',
    'There are only 10 kinds of people in this world: those who know binary and those who don’t.',
    'A SQL query walks into a bar, walks up to two tables and asks: “Can I join you?”',
    'Why do Java developers wear glasses? Because they don’t C#.',
    'I would tell you a UDP joke, but you might not get it.',
    'To understand what recursion is, you must first understand recursion.'
  ];

  // Banner art for the banner command
  const bannerArt =
    '*******************************************\n' +
    '*      Welcome to Tamanbir Singh\'s       *\n' +
    '*         Terminal Resume!                *\n' +
    '*******************************************';

  // Append a line to the output
  function addOutputLine(content, cssClass) {
    const p = document.createElement('p');
    if (cssClass) {
      p.classList.add(cssClass);
    }
    p.innerHTML = content;
    outputDiv.appendChild(p);
  }

  // Append command line with prompt
  function addCommandLine(command) {
    const line = `<span class="prompt">$</span> ${command}`;
    addOutputLine(line, 'command-line');
  }

  // Scroll to bottom
  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Display welcome message
  addOutputLine('Welcome to Tamanbir Singh\'s resume terminal. Type "help" to begin.');
  scrollToBottom();

  // Handle key events
  commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const command = commandInput.value.trim();
      if (command !== '') {
        commandHistory.push(command);
        historyIndex = commandHistory.length;
        addCommandLine(command);
        handleCommand(command.toLowerCase());
      }
      commandInput.value = '';
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        commandInput.value = commandHistory[historyIndex];
      } else if (historyIndex === 0) {
        commandInput.value = commandHistory[0];
      }
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        commandInput.value = commandHistory[historyIndex];
      } else {
        commandInput.value = '';
        historyIndex = commandHistory.length;
      }
      event.preventDefault();
    }
  });

  // Main command handler
  function handleCommand(command) {
    switch (command) {
      case 'help':
        addOutputLine('Available commands:', 'info');
        addOutputLine('help – show this help message');
        addOutputLine('ls – list directories or files');
        addOutputLine('cd [directory] – change directory');
        addOutputLine('cat [filename] – view file contents');
        addOutputLine('clear – clear the screen');
        addOutputLine('contact – show contact details');
        addOutputLine('linkedin – open LinkedIn profile');
        addOutputLine('github – open GitHub profile');
        addOutputLine('portfolio – open portfolio');
        addOutputLine('whoami – display your name');
        addOutputLine('pwd – print current directory');
        addOutputLine('date – display current date and time');
        addOutputLine('history – show command history');
        addOutputLine('banner – show a welcome banner');
        addOutputLine('about – display the about summary');
        addOutputLine('education – show education details');
        addOutputLine('experience – show work experience');
        addOutputLine('skills – list technical skills');
        addOutputLine('certifications – list certifications');
        addOutputLine('quote – show a random programming quote');
        addOutputLine('joke – tell a programming joke');
        addOutputLine('matrix – display matrix rain art');
        addOutputLine('echo [text] – print the given text');
        addOutputLine('calc [expression] – evaluate a math expression');
        addOutputLine('theme [default|matrix] – change the colour theme');
        break;
      case 'ls':
        if (currentDirectory === '/') {
          addOutputLine('about\ncertifications\nexperience\neducation\nskills');
        } else {
          const filesInDirectory = Object.keys(fileContents).filter((file) => file.startsWith(currentDirectory + '/'));
          if (filesInDirectory.length > 0) {
            const fileNames = filesInDirectory.map((file) => file.substring(currentDirectory.length + 1));
            addOutputLine(fileNames.join('\n') + '\nUse "cat filename.txt" to view content');
          } else {
            addOutputLine('No files found in this directory.');
          }
        }
        break;
      case 'clear':
        outputDiv.innerHTML = '';
        break;
      case 'contact':
        addOutputLine('Phone: 647‑425‑4733');
        addOutputLine('Email: <a href="mailto:tamanjaj@gmail.com">tamanjaj@gmail.com</a>');
        addOutputLine('LinkedIn: <a href="https://linkedin.com/in/tamanbir" target="_blank" rel="noopener">linkedin.com/in/tamanbir</a>');
        addOutputLine('GitHub: <a href="https://github.com/Tamanbir" target="_blank" rel="noopener">github.com/Tamanbir</a>');
        addOutputLine('Portfolio: <a href="https://tamanbir.github.io" target="_blank" rel="noopener">tamanbir.github.io</a>');
        break;
      case 'linkedin':
        addOutputLine('Opening LinkedIn profile...');
        window.open('https://linkedin.com/in/tamanbir', '_blank');
        break;
      case 'github':
        addOutputLine('Opening GitHub profile...');
        window.open('https://github.com/Tamanbir', '_blank');
        break;
      case 'portfolio':
        addOutputLine('Opening portfolio...');
        window.open('https://tamanbir.github.io', '_blank');
        break;
      case 'whoami':
        addOutputLine('Tamanbir Singh');
        break;
      case 'pwd':
        addOutputLine(currentDirectory);
        break;
      case 'date':
        addOutputLine(new Date().toString());
        break;
      case 'history':
        if (commandHistory.length === 0) {
          addOutputLine('No commands in history yet.');
        } else {
          addOutputLine(commandHistory.join('\n'));
        }
        break;
      case 'banner':
        addOutputLine(bannerArt, 'info');
        break;
      case 'about':
        addOutputLine(fileContents['/about/about.txt']);
        break;
      case 'education':
        addOutputLine(fileContents['/education/education.txt']);
        break;
      case 'experience':
        addOutputLine(fileContents['/experience/experience.txt']);
        break;
      case 'skills':
        addOutputLine(fileContents['/skills/skills.txt']);
        break;
      case 'certifications':
        addOutputLine(fileContents['/certifications/certifications.txt']);
        break;
      case 'quote': {
        const rand = Math.floor(Math.random() * quotes.length);
        addOutputLine(quotes[rand], 'info');
        break;
      }
      case 'joke': {
        const rand = Math.floor(Math.random() * jokes.length);
        addOutputLine(jokes[rand], 'info');
        break;
      }
      case 'matrix': {
        // Generate a simple matrix rain pattern
        const rows = 20;
        const cols = 40;
        let art = '';
        for (let i = 0; i < rows; i++) {
          let row = '';
          for (let j = 0; j < cols; j++) {
            row += Math.random() < 0.5 ? '0' : '1';
          }
          art += row + '\n';
        }
        addOutputLine(art, 'info');
        break;
      }
      default:
        if (command.startsWith('cd ')) {
          const newDir = command.substring(3).trim();
          if (newDir === '..' || newDir === '/') {
            currentDirectory = '/';
            addOutputLine('Directory changed to /');
          } else if (
            newDir === 'about' ||
            newDir === 'certifications' ||
            newDir === 'experience' ||
            newDir === 'education' ||
            newDir === 'skills'
          ) {
            currentDirectory = '/' + newDir;
            addOutputLine('Directory changed to ' + currentDirectory);
          } else {
            addOutputLine('Directory not found: ' + newDir, 'error');
          }
        } else if (command.startsWith('cat ')) {
          const filename = command.substring(4).trim();
          const filePath = currentDirectory + '/' + filename;
          const fileContent = fileContents[filePath];
          if (fileContent) {
            addOutputLine(fileContent);
          } else {
            addOutputLine('File not found: ' + filename, 'error');
          }
        } else if (command.startsWith('echo ')) {
          // Echo prints the text following the command
          const text = command.substring(5);
          addOutputLine(text);
        } else if (command.startsWith('calc ')) {
          // Evaluate a math expression
          const expr = command.substring(5);
          try {
            // eslint-disable-next-line no-eval
            const result = eval(expr);
            addOutputLine(String(result));
          } catch (err) {
            addOutputLine('Invalid expression', 'error');
          }
        } else if (command.startsWith('theme')) {
          // Change between default and matrix themes
          const parts = command.split(' ');
          if (parts.length === 1 || parts[1] === 'default') {
            document.body.classList.remove('matrix-theme');
            addOutputLine('Theme set to default.');
          } else if (parts[1] === 'matrix') {
            document.body.classList.add('matrix-theme');
            addOutputLine('Theme set to matrix.');
          } else {
            addOutputLine('Usage: theme [default|matrix]', 'error');
          }
        } else {
          addOutputLine('Command not found: ' + command, 'error');
        }
        break;
    }
    scrollToBottom();
  }
});