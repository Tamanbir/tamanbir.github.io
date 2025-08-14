/*
  JavaScript to power the interactive resume terminal.

  This script enhances the user experience by preserving command
  history, supporting navigation through previous commands with the
  arrow keys, and automatically scrolling the output area when new
  content is added. Custom commands provide access to the candidate’s
  profile, education, work experience, skills and certifications. In
  addition, shortcut commands can open external links such as
  LinkedIn, GitHub and the candidate’s portfolio in a new tab. A
  contact command displays contact details directly within the
  terminal.
*/

document.addEventListener('DOMContentLoaded', () => {
  const outputDiv = document.querySelector('.terminal-output');
  const commandInput = document.querySelector('.command-input');
  const terminalBody = document.querySelector('.terminal-body');

  // Set the copyright year dynamically
  const yearSpan = document.getElementById('year');
  if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear().toString();
  }

  // Command history management
  const commandHistory = [];
  let historyIndex = -1;

  // Virtual file system for resume content
  let currentDirectory = '/';
  const fileContents = {
    '/about/about.txt':
      'Experienced Java developer with a strong background in microservices architecture, Java/J2EE and secure application development. Skilled in the full software development lifecycle (SDLC), from requirements gathering to deployment, with proven expertise in REST/gRPC APIs, cloud platforms (AWS, Azure) and application security scanning. Adept at working in Agile environments, integrating CI/CD pipelines and delivering high‑quality, scalable and secure solutions for enterprise systems.',
    '/certifications/certifications.txt':
      '1. AWS Certified Cloud Practitioner<br>2. Certified Ethical Hacker v9 – EC‑Council<br>3. Machine Learning &amp; Deep Learning – Hewlett Packard Enterprise',
    '/experience/experience.txt':
      '1. Java Developer @ Commerce Dynamics (May 2022 – Present)<br><br>' +
      '• Design, develop and maintain microservices‑based enterprise applications using Java/J2EE, Spring Boot and RESTful APIs; integrate with external systems via JSON and gRPC.<br>' +
      '• Implement CI/CD pipelines using Jenkins, Maven and Gradle; streamline deployment to AWS and Azure environments via Dockerised builds.<br>' +
      '• Conduct application security scans with SonarQube, Fortify and Black Duck, ensuring code compliance with OWASP standards.<br>' +
      '• Collaborate in an Agile setting, actively participating in sprint planning, grooming and retrospectives while adhering to structured SDLC processes.<br>' +
      '• Work extensively with RDBMS/SQL (MSSQL, PostgreSQL) for database design, query optimisation and stored procedure development.<br>' +
      '• Integrate OAuth and Okta for secure single sign‑on (SSO) functionality.<br>' +
      '• Use Postman for API testing and JUnit for automated unit and integration testing, improving test coverage by 30 percent.<br><br>' +
      '2. Software Experience Labs Student (Intern) @ BlackBerry (Jan 2022 – Apr 2022)<br><br>' +
      '• Assisted in microservices and REST API validation for enterprise security products.<br>' +
      '• Developed automation scripts in PowerShell to streamline Active Directory user/group management and environment setup.<br>' +
      '• Worked with SIEM tools (Cylance, XmCyber, Splunk, QRadar) to monitor and investigate potential security threats.<br>' +
      '• Deployed and tested software in Docker containers for cross‑platform compatibility checks.<br>' +
      '• Participated in application vulnerability scanning using Fortify and SonarQube, reporting and remediating findings according to security best practices.<br><br>' +
      '3. Freelancer – Security Analyst (Jun 2016 – Aug 2020)<br><br>' +
      '• Delivered vulnerability assessment and penetration testing (VAPT) services for web, mobile and network systems.<br>' +
      '• Designed and implemented secure architecture recommendations for applications using Java, Spring and microservices patterns.<br>' +
      '• Provided compliance solutions for HIPAA and PCI DSS, ensuring systems met regulatory requirements.<br>' +
      '• Created automated security scripts in Python for scanning REST endpoints and generating JSON‑based vulnerability reports.<br>' +
      '• Integrated findings into client SDLC pipelines, improving security posture before production releases.',
    '/education/education.txt':
      '1. Lambton College, Toronto, ON – Cloud Computing for Big Data (Post‑Graduate Diploma) – Sep 2020 – Apr 2022. GPA: 3.5/4.0<br><br>' +
      '2. Guru Nanak Dev University, Punjab, India – Master of Computer Applications – Dec 2019. CGPA: 7.22/10',
    '/skills/skills.txt':
      'Languages: Java, Python, JavaScript, HTML/CSS<br>' +
      'Frameworks: Spring Boot, JSP, Servlets, Django<br>' +
      'APIs: REST, gRPC, JSON<br>' +
      'Testing: JUnit, Postman, Swagger, curl<br>' +
      'Build Tools: Maven, Gradle<br>' +
      'Databases: MySQL, MSSQL, PostgreSQL<br>' +
      'Cloud: AWS, Azure<br>' +
      'DevOps: Jenkins, Docker, Git, SVN, CI/CD<br>' +
      'Security Tools: SonarQube, Fortify, Black Duck, Acunetix, Burp Suite, OWASP ZAP, Wireshark, Nessus, Nmap, Metasploit<br>' +
      'Agile/SDLC: Scrum, Kanban, Secure Coding Practices'
  };

  // Helper: append a line to the terminal output
  function addOutputLine(content, cssClass) {
    const p = document.createElement('p');
    if (cssClass) {
      p.classList.add(cssClass);
    }
    p.innerHTML = content;
    outputDiv.appendChild(p);
  }

  // Helper: append a typed command line
  function addCommandLine(command) {
    // Combine prompt and command into a single line
    const line = `<span class="prompt">$</span> ${command}`;
    addOutputLine(line, 'command-line');
  }

  // Ensure output area scrolls to the bottom
  function scrollToBottom() {
    terminalBody.scrollTop = terminalBody.scrollHeight;
  }

  // Display welcome message on load
  addOutputLine('Welcome to Tamanbir Singh Jaj\'s resume terminal. Type \"help\" to begin.');
  scrollToBottom();

  // Handle command input
  commandInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const command = commandInput.value.trim();
      // Do nothing if command is empty
      if (command === '') {
        event.preventDefault();
        return;
      }
      // Store command in history
      commandHistory.push(command);
      historyIndex = commandHistory.length;
      // Show typed command in output
      addCommandLine(command);
      // Process the command
      handleCommand(command.toLowerCase());
      // Clear input field
      commandInput.value = '';
      event.preventDefault();
    } else if (event.key === 'ArrowUp') {
      // Navigate up in command history
      if (commandHistory.length > 0 && historyIndex > 0) {
        historyIndex--;
        commandInput.value = commandHistory[historyIndex];
      } else if (historyIndex === 0) {
        commandInput.value = commandHistory[0];
      }
      event.preventDefault();
    } else if (event.key === 'ArrowDown') {
      // Navigate down in command history
      if (commandHistory.length > 0 && historyIndex < commandHistory.length - 1) {
        historyIndex++;
        commandInput.value = commandHistory[historyIndex];
      } else {
        // If at the end, clear
        commandInput.value = '';
        historyIndex = commandHistory.length;
      }
      event.preventDefault();
    }
  });

  // Main command handler
  function handleCommand(command) {
    // Built‑in commands
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
        break;
      case 'ls':
        if (currentDirectory === '/') {
          addOutputLine('about\ncertifications\nexperience\neducation\nskills');
        } else {
          // List files in the current directory
          const filesInDirectory = Object.keys(fileContents).filter((file) => file.startsWith(currentDirectory + '/'));
          if (filesInDirectory.length > 0) {
            const fileNames = filesInDirectory.map((file) => file.substring(currentDirectory.length + 1));
            addOutputLine(fileNames.join('\n') + '\nUse \"cat filename.txt\" to view content');
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
      default:
        // Handle directory navigation and file display
        if (command.startsWith('cd ')) {
          const newDir = command.substring(3).trim();
          if (newDir === '..') {
            // Move up to root
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
        } else {
          addOutputLine('Command not found: ' + command, 'error');
        }
        break;
    }
    // Scroll to bottom after processing
    scrollToBottom();
  }
});