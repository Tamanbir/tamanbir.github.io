const outputDiv = document.querySelector('.output');
const commandInput = document.querySelector('.command-input');
let currentDirectory = '/';
const fileContents = {
  '/about/about.txt': "Experienced Java Developer with Cybersecurity expertise. Strong knowledge of secure coding practices, threat modeling, and security architecture. Skilled in developing secure web applications, implementing secure coding practices, and conducting security assessments. Strong problem-solving skills with a collaborative approach to teamwork. Looking to apply skills and experience to add value to an organization.",
  '/certifications/certifications.txt': '1.	AWS Certified Cloud Practitioner<br> 2. Machine Learning and Deep learning Hewlett Packard Enterprise Certified',
  '/experience/experience.txt': "1. Java Developer @ Commerce Dynamics (May 2022 - Present)<br> •	Lead and actively participate in the complete software development lifecycle, encompassing requirement analysis, meticulous design, coding, exhaustive testing, and ongoing maintenance. <br> •	Specialize in Java development, leveraging Enterprise Java Beans (EJB), and demonstrate expertise in crafting secure, high-performance applications. <br>  •	Leverage the power of the Apache Struts Framework to create personalized client solutions.<br> •	Engaged proactively in the analysis, detailed design, development, debugging, bug fixing and enhancement phases following Agile methodologies. <br>  •	Drive innovation by introducing new functionality to existing codebases, amplifying application capabilities.<br>  &nbsp;•	Establish seamless integrations with RESTful APIs, ensuring efficient and secure data exchange for enhanced application performance. <br>  <br> 2. Software Experience Labs Co-op/Intern @ BlackBerry (January 2022 - April 2022) <br> •	Hands-on experience with various products and services as Cylance, XmCyber, Isec7 and Splunk <br>  •	Scripting and Automation for creating users, assigning groups using active directory and PowerShell scripts.<br>  •	Setting up virtual machines for testing purposes. <br>  •	Assistance with testing requests to help replicate issues and bring resolution to customer PoC issues. <br>  •	Setting up Groups and Servers using Remote Desktop Connection Manager.",
  '/education/education.txt': "1. Master of computer application - Guru Nanak Dev University <br> 2. Cloud Computing for Big Data (Ontario Post Graduate Diploma) - Lambton College",
  '/skills/skills.txt': "Programming Languages: Python, Java, R, HTML/CSS, JavaScript <br> Frameworks: Django, JSP , Servlets <br> Security Tools: Acunetix, Burpsuit Owasp Zap, Wireshark, Nessus, Nmap, MetaSploit and et cetra."
  // Add entries for other text files in different directories
};

commandInput.addEventListener('keydown', function (event) {
  if (event.key === 'Enter') {
    const command = this.value.trim().toLowerCase();
    this.value = '';
    handleCommand(command); // Call the handleCommand function
  }
});

function handleCommand(command) {
  switch (command) {
    case 'help':
      outputDiv.innerHTML +=
        '<p>Available commands:<br>' +
        'cd [directory]<br>' +
        'ls<br>' +
        'cat [filename]<br>' +
        'clear<br>' +
        'help</p>';
      break;
    case 'ls':
      if (currentDirectory === '/') {
        outputDiv.innerHTML += '<p>Available directories:<br>' +
          'about<br>' +
          'certifications<br>' +
          'experience<br>' +
          'education<br>' +
          'skills<br>'+
          '</p>';
      } else {
        // List files in the current directory
        const filesInDirectory = Object.keys(fileContents).filter(file => file.startsWith(currentDirectory));
        outputDiv.innerHTML += '<p>Available files:<br>' +
          filesInDirectory.map(file => file.substring(currentDirectory.length + 1)).join('<br>') +
          '</p>' + '<p>  Use "cat filename.txt" to view content </p>';
      }
      break;
    case 'about':
      outputDiv.innerHTML +=
        "<p>Experienced Java Developer with Cybersecurity expertise. Strong knowledge of secure coding practices, threat modeling, and security architecture. Skilled in developing secure web applications, implementing secure coding practices, and conducting security assessments. Strong problem-solving skills with a collaborative approach to teamwork. Looking to apply skills and experience to add value to an organization.</p>";
      break;
      case 'cd':
      currentDirectory = '/';
      outputDiv.innerHTML += '<p>Directory changed to /.</p>';
      break;
    case 'clear':
      outputDiv.innerHTML = '';
      break;
    default:
      // Handle 'cd [directory]' command
      if (command.startsWith('cd ')) {
        const newDirectory = command.substring(3).trim();
        if (newDirectory === 'about' || newDirectory === 'certifications' || newDirectory == 'experience' || newDirectory == 'education' || newDirectory == 'skills') {
          currentDirectory = '/' + newDirectory;
          outputDiv.innerHTML += '<p>Directory changed to ' + currentDirectory + '.</p>'  + '<p>Use ls to list contents of the directory</p>';
        } else {
          outputDiv.innerHTML += '<p>Directory not found.</p>';
        }
      } else if (command.startsWith('cat ')) {
        const filename = command.substring(4).trim();
        const filePath = currentDirectory + '/' + filename;
        const fileContent = fileContents[filePath];
        if (fileContent) {
          outputDiv.innerHTML += '<p>' + fileContent + '</p>';
        } else {
          outputDiv.innerHTML += '<p>File not found.</p>';
        }
      } else {
        outputDiv.innerHTML +=
          '<p>Command not found. Type "help" to see available commands.</p>';
      }
      break;
  }
}
