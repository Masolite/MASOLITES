document.addEventListener('DOMContentLoaded', function() {
    const form = document.getElementById('registrationForm');
    const modal = document.getElementById('successModal');
    const closeBtn = document.querySelector('.close');
    const uniqueIdDisplay = document.getElementById('uniqueId');
    const copyBtn = document.getElementById('copyBtn');

    // Generate MSL ID (11 digits total: MSL + 8 random digits)
    function generateMSLId() {
        const randomNum = Math.floor(10000000 + Math.random() * 90000000);
        return `MSL${randomNum}`;
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form values
        const name = document.getElementById('name').value;
        const state = document.getElementById('state').value;
        const email = document.getElementById('email').value;
        const phone = document.getElementById('phone').value;
        
        // Generate IDs
        const mslId = generateMSLId();
        const altId = phone; // Phone number as alternate ID
        
        // Store in localStorage (for demo)
        const member = {
            name,
            mslId,
            state,
            email,
            phone,
            altId,
            date: new Date().toISOString()
        };
        
        let members = JSON.parse(localStorage.getItem('masolitesMembers')) || [];
        members.push(member);
        localStorage.setItem('masolitesMembers', JSON.stringify(members));
        
        // Show success modal
        uniqueIdDisplay.textContent = mslId;
        modal.style.display = 'block';
        
        // In a real implementation, send email here
        console.log(`Would send email to ${email} with ID: ${mslId}`);
    });

    // Close modal
    closeBtn.addEventListener('click', function() {
        modal.style.display = 'none';
    });

    // Copy ID to clipboard
    copyBtn.addEventListener('click', function() {
        navigator.clipboard.writeText(uniqueIdDisplay.textContent)
            .then(() => {
                copyBtn.textContent = 'Copied!';
                setTimeout(() => {
                    copyBtn.textContent = 'Copy ID';
                }, 2000);
            });
    });

    // For admin export (would be protected in real implementation)
    window.exportMembers = function(format) {
        const members = JSON.parse(localStorage.getItem('masolitesMembers')) || [];
        if (members.length === 0) {
            alert('No members registered yet');
            return;
        }
        
        if (format === 'csv') {
            // CSV export implementation
            let csv = 'Name,MSL ID,State,Email,Phone,Alternate ID,Date\n';
            members.forEach(m => {
                csv += `"${m.name}","${m.mslId}","${m.state}","${m.email}","${m.phone}","${m.altId}","${m.date}"\n`;
            });
            
            const blob = new Blob([csv], { type: 'text/csv' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'masolites_members.csv';
            a.click();
        } else {
            alert(`${format} export would be implemented here`);
        }
    };
})
