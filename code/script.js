
        import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-app.js';
        import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-auth.js';
        import { getDatabase, ref, push, set, get, query, orderByChild, equalTo, onValue, update, remove } from 'https://www.gstatic.com/firebasejs/10.7.0/firebase-database.js';


        const firebaseConfig = {
            apiKey: "AIzaSyAgStf6_a4BB-jl9MPJWWcDFjFJ9BM-vnQ",
            authDomain: "blooddonorfinder-sylhet.firebaseapp.com",
            projectId: "blooddonorfinder-sylhet",
            storageBucket: "blooddonorfinder-sylhet.firebasestorage.app",
            messagingSenderId: "303556876343",
            appId: "1:303556orfinder-sylhet", 
            databaseURL: "https://blooddonorfinder-sylhet-default-rtdb.firebaseio.com"
        };

        // Initialize Firebase
        const app = initializeApp(firebaseConfig);
        const auth = getAuth(app);
        const database = getDatabase(app);


        const AVATAR_OPTIONS = [
            'https://i.pravatar.cc/150?img=1',
            'https://i.pravatar.cc/150?img=2',
            'https://i.pravatar.cc/150?img=3',
            'https://i.pravatar.cc/150?img=4',
            'https://i.pravatar.cc/150?img=5',
            'https://i.pravatar.cc/150?img=6',
            'https://i.pravatar.cc/150?img=7',
            'https://i.pravatar.cc/150?img=8',
            'https://i.pravatar.cc/150?img=9',
            'https://i.pravatar.cc/150?img=10',
            'https://i.pravatar.cc/150?img=11',
            'https://i.pravatar.cc/150?img=12',
            'https://i.pravatar.cc/150?img=13',
            'https://i.pravatar.cc/150?img=14',
            'https://i.pravatar.cc/150?img=15',
            'https://i.pravatar.cc/150?img=16',
            'https://i.pravatar.cc/150?img=17',
            'https://i.pravatar.cc/150?img=18',
            'https://i.pravatar.cc/150?img=19',
            'https://i.pravatar.cc/150?img=20'
        ];

        const LOGO_URL = '';

        if (LOGO_URL) {
            document.getElementById('brandLogoImg').src = LOGO_URL;
            document.getElementById('brandLogoImg').style.display = 'inline-block';
            document.getElementById('brandLogoIcon').style.display = 'none';
        }

  
        function renderAvatarPicker() {
            const grid = document.getElementById('avatarPickerGrid');
            if (!grid) return;
            grid.innerHTML = AVATAR_OPTIONS.map((url, i) => `
                <div class="avatar-option" data-url="${url}" onclick="selectAvatar('${url}', this)">
                    <img src="${url}" alt="Avatar ${i + 1}" loading="lazy">
                </div>
            `).join('');
        }
        renderAvatarPicker();

        window.selectAvatar = function(url, el) {
            document.getElementById('selectedAvatarUrl').value = url;
            document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
            el.classList.add('selected');
        };

   
        let currentUser = null;
        let currentUserData = null;
        let authMode = 'signin'; 
        let allDonors = [];
        let allRequests = [];
        let allUsers = [];

   
        const locationData = {
            'Sylhet': ['Sylhet Sadar', 'Biyanibazar', 'Jaintiapur', 'Kanaighat', 'Companyganj', 'Golapganj', 'Osmani Nagar'],
            'Sunamganj': ['Sunamganj Sadar', 'Tahirpur', 'Jamalganj', 'Dakshin Sunamganj', 'Dharmapasha', 'Jagannathpur'],
            'Moulvibazar': ['Moulvibazar Sadar', 'Kulaura', 'Rajnail', 'Barlekha', 'Juri', 'Srimangal', 'Kamalganj'],
            'Habiganj': ['Habiganj Sadar', 'Baniachang', 'Lakhai', 'Madhabpur', 'Nabiganj', 'Chunarughat']
        };


        onAuthStateChanged(auth, async (user) => {
            if (user) {
                currentUser = user;
                document.getElementById('authLink').textContent = 'Logout';
                document.getElementById('authLink').onclick = () => logout();
                document.getElementById('navDashboard').style.display = 'block';
                document.getElementById('navNearby').style.display = 'block';

  
                const userRef = ref(database, `users/${user.uid}`);
                onValue(userRef, (snapshot) => {
                    currentUserData = snapshot.val();
                    if (currentUserData && currentUserData.isAdmin) {
                        document.getElementById('navAdmin').style.display = 'block';
                    } else {
                        document.getElementById('navAdmin').style.display = 'none';
                    }
                });
            } else {
                currentUser = null;
                currentUserData = null;
                document.getElementById('authLink').textContent = 'Login';
                document.getElementById('authLink').onclick = () => showSection('login');
                document.getElementById('navDashboard').style.display = 'none';
                document.getElementById('navNearby').style.display = 'none';
                document.getElementById('navAdmin').style.display = 'none';
            }
        });


        window.showSection = function(sectionId) {
            document.querySelectorAll('.section').forEach(section => {
                section.classList.remove('active');
                section.style.display = 'none';
            });
            document.getElementById(sectionId).classList.add('active');
            document.getElementById(sectionId).style.display = 'block';

            if (sectionId === 'userDashboard' && currentUser) {
                loadUserDashboard();
            } else if (sectionId === 'adminPanel' && currentUserData?.isAdmin) {
                loadAdminDonors();
                loadAdminRequests();
                loadAdminUsers();
                loadAdminStats();
            } else if (sectionId === 'home') {
                loadHomeStatistics();
                loadDistrictCounts();
            } else if (sectionId === 'emergencyRequest') {
                loadEmergencyRequests();
            }

     
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse.classList.contains('show')) {
                new bootstrap.Collapse(navbarCollapse).hide();
            }

            window.scrollTo(0, 0);
        };

        window.toggleAuthMode = function() {
            authMode = authMode === 'signin' ? 'signup' : 'signin';
            const authButton = document.getElementById('authButton');
            const authForm = document.getElementById('authForm');
            
            if (authMode === 'signup') {
                document.querySelector('#login .card-header').textContent = 'Create New Account';
                authButton.innerHTML = '<i class="fas fa-user-plus"></i> Sign Up';
                authButton.parentElement.querySelector('.text-muted').innerHTML = 'Already have an account? <a href="#" onclick="toggleAuthMode()" style="color: var(--primary); text-decoration: none; font-weight: 600;">Sign In</a>';
            } else {
                document.querySelector('#login .card-header').textContent = 'Sign In to Your Account';
                authButton.innerHTML = '<i class="fas fa-sign-in-alt"></i> Sign In';
                authButton.parentElement.querySelector('.text-muted').innerHTML = 'Don\'t have an account? <a href="#" onclick="toggleAuthMode()" style="color: var(--primary); text-decoration: none; font-weight: 600;">Create one</a>';
            }
        };

        window.handleAuth = async function(e) {
            e.preventDefault();
            const email = document.getElementById('authEmail').value;
            const password = document.getElementById('authPassword').value;

            if (!email || !password) {
                showToast('Please fill all fields', 'error');
                return;
            }

            try {
                if (authMode === 'signin') {
                    await signInWithEmailAndPassword(auth, email, password);
                    showToast('Logged in successfully', 'success');
                    setTimeout(() => showSection('home'), 1000);
                } else {
                    const result = await createUserWithEmailAndPassword(auth, email, password);
       
                    await set(ref(database, `users/${result.user.uid}`), {
                        email: email,
                        createdAt: new Date().toISOString(),
                        isAdmin: false
                    });
                    showToast('Account created successfully', 'success');
                    setTimeout(() => showSection('home'), 1000);
                }
            } catch (error) {
                showToast(error.message, 'error');
            }
        };

        window.logout = async function() {
            try {
                await signOut(auth);
                showToast('Logged out successfully', 'success');
                showSection('home');
            } catch (error) {
                showToast(error.message, 'error');
            }
        };


        document.getElementById('authForm')?.addEventListener('submit', window.handleAuth);


        document.getElementById('donorForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();

            if (!currentUser) {
                showToast('Please log in first', 'error');
                showSection('login');
                return;
            }

            const selectedAvatar = document.getElementById('selectedAvatarUrl').value;
            if (!selectedAvatar) {
                showToast('Please choose a profile picture', 'error');
                return;
            }

            const donorData = {
                userId: currentUser.uid,
                name: document.getElementById('donorName').value,
                bloodGroup: document.getElementById('donorBloodGroup').value,
                mobile: document.getElementById('donorMobile').value,
                district: document.getElementById('donorDistrict').value,
                upazila: document.getElementById('donorUpazila').value,
                area: document.getElementById('donorArea').value,
                gender: document.getElementById('donorGender').value || 'Not specified',
                lastDonationDate: document.getElementById('lastDonationDate').value || null,
                photoURL: selectedAvatar,
                isAvailable: true,
                isVerified: false,
                createdAt: new Date().toISOString()
            };

            try {
       
                await set(ref(database, `donors/${currentUser.uid}`), donorData);


                await update(ref(database, `users/${currentUser.uid}`), {
                    isDonor: true
                });

                showToast('Donor profile created successfully!', 'success');
                document.getElementById('donorForm').reset();
                document.getElementById('selectedAvatarUrl').value = '';
                document.querySelectorAll('.avatar-option').forEach(opt => opt.classList.remove('selected'));
                setTimeout(() => showSection('home'), 1500);
            } catch (error) {
                showToast('Error creating donor profile: ' + error.message, 'error');
            }
        });


        document.getElementById('emergencyForm')?.addEventListener('submit', async (e) => {
            e.preventDefault();

            const requestData = {
                patientName: document.getElementById('patientName').value,
                bloodGroup: document.getElementById('requiredBloodGroup').value,
                hospitalName: document.getElementById('hospitalName').value,
                district: document.getElementById('emergencyDistrict').value,
                location: document.getElementById('emergencyLocation').value,
                bagsRequired: document.getElementById('bagsRequired').value,
                requiredDate: document.getElementById('requiredDate').value,
                contactNumber: document.getElementById('emergencyContact').value,
                urgencyLevel: document.getElementById('urgencyLevel').value,
                message: document.getElementById('emergencyMessage').value,
                status: 'Open',
                createdAt: new Date().toISOString(),
                userId: currentUser?.uid || 'anonymous'
            };

            try {
                await push(ref(database, 'bloodRequests'), requestData);
                showToast('Emergency request submitted!', 'success');
                document.getElementById('emergencyForm').reset();
                loadEmergencyRequests();
            } catch (error) {
                showToast('Error submitting request: ' + error.message, 'error');
            }
        });


        window.loadHomeStatistics = async function() {
            try {
                const donorsRef = ref(database, 'donors');
                const requestsRef = ref(database, 'bloodRequests');

                onValue(donorsRef, (snapshot) => {
                    allDonors = [];
                    let totalDonors = 0;
                    let availableDonors = 0;

                    snapshot.forEach((child) => {
                        const donor = child.val();
                        allDonors.push({ id: child.key, ...donor });
                        totalDonors++;
                        if (donor.isAvailable) availableDonors++;
                    });

                    document.getElementById('totalDonorsCount').textContent = totalDonors;
                    document.getElementById('availableDonorsCount').textContent = availableDonors;
                    loadDistrictCounts();
                });

                onValue(requestsRef, (snapshot) => {
                    allRequests = [];
                    let totalRequests = 0;
                    let emergencyRequests = 0;

                    snapshot.forEach((child) => {
                        const request = child.val();
                        allRequests.push({ id: child.key, ...request });
                        totalRequests++;
                        if (request.urgencyLevel === 'Critical' || request.urgencyLevel === 'Urgent') {
                            emergencyRequests++;
                        }
                    });

                    document.getElementById('totalRequestsCount').textContent = totalRequests;
                    document.getElementById('emergencyRequestsCount').textContent = emergencyRequests;
                });
            } catch (error) {
                console.error('Error loading statistics:', error);
            }
        };


        window.loadDistrictCounts = function() {
            const districtCounts = {};
            allDonors.forEach(donor => {
                districtCounts[donor.district] = (districtCounts[donor.district] || 0) + 1;
            });

            const districts = ['Sylhet', 'Sunamganj', 'Moulvibazar', 'Habiganj'];
            districts.forEach(district => {
                const count = districtCounts[district] || 0;
                const element = document.getElementById(`${district.toLowerCase()}-count`);
                if (element) {
                    element.textContent = `${count} Donor${count !== 1 ? 's' : ''}`;
                }
            });
        };


        window.updateUpazilas = function(prefix) {
            const districtSelect = document.getElementById(`${prefix}District`);
            const upazilaSelect = document.getElementById(`${prefix}Upazila`);
            const district = districtSelect.value;

            upazilaSelect.innerHTML = '<option value="">Select Upazila</option>';

            if (district && locationData[district]) {
                locationData[district].forEach(upazila => {
                    const option = document.createElement('option');
                    option.value = upazila;
                    option.textContent = upazila;
                    upazilaSelect.appendChild(option);
                });
            }
        };


        window.searchByDistrict = function(district) {
            showSection('findDonor');
            document.getElementById('searchDistrict').value = district;
            updateUpazilas('search');
            applyFilters();
        };

 
        window.applyFilters = function() {
            const bloodGroup = document.getElementById('searchBloodGroup').value;
            const district = document.getElementById('searchDistrict').value;
            const upazila = document.getElementById('searchUpazila').value;
            const area = document.getElementById('searchArea').value.toLowerCase();
            const availableOnly = document.getElementById('availableOnly').checked;

            let filtered = allDonors.filter(donor => {
                let match = true;

                if (bloodGroup && donor.bloodGroup !== bloodGroup) match = false;
                if (district && donor.district !== district) match = false;
                if (upazila && donor.upazila !== upazila) match = false;
                if (area && !donor.area.toLowerCase().includes(area)) match = false;
                if (availableOnly && !donor.isAvailable) match = false;

                return match;
            });

            displayDonorResults(filtered);
        };


        window.displayDonorResults = function(donors) {
            const resultsContainer = document.getElementById('donorResults');

            if (donors.length === 0) {
                resultsContainer.innerHTML = `
                    <div class="col-12">
                        <div class="empty-state">
                            <div class="empty-icon"><i class="fas fa-user-slash"></i></div>
                            <div class="empty-title">No Donors Found</div>
                            <div class="empty-text">Try adjusting your search filters to find available donors.</div>
                        </div>
                    </div>
                `;
                return;
            }

            resultsContainer.innerHTML = donors.map(donor => `
                <div class="col-md-6 col-lg-4 mb-4">
                    <div class="donor-card">
                        <div class="donor-image">
                            ${donor.photoURL ? `<img src="${donor.photoURL}" style="width: 100%; height: 100%; object-fit: cover;">` : '<i class="fas fa-user"></i>'}
                        </div>
                        <div class="donor-info">
                            <div class="donor-name">${donor.name}</div>
                            <div class="donor-blood-badge">${donor.bloodGroup}</div>
                            <div class="donor-details"><i class="fas fa-map-marker-alt"></i> ${donor.district}, ${donor.upazila}</div>
                            <div class="donor-details"><i class="fas fa-home"></i> ${donor.area}</div>
                            ${donor.lastDonationDate ? `<div class="donor-details"><i class="fas fa-calendar"></i> Last: ${new Date(donor.lastDonationDate).toLocaleDateString()}</div>` : ''}
                            <div class="donor-status">
                                <span class="status-badge ${donor.isAvailable ? 'status-available' : 'status-unavailable'}">
                                    ${donor.isAvailable ? '<i class="fas fa-check-circle"></i> Available' : '<i class="fas fa-times-circle"></i> Not Available'}
                                </span>
                                ${donor.isVerified ? '<span class="status-badge status-verified"><i class="fas fa-check"></i> Verified</span>' : ''}
                            </div>
                            <div class="donor-actions">
                                <button class="btn-action btn-call" onclick="callDonor('${donor.mobile}')">
                                    <i class="fas fa-phone"></i> Call
                                </button>
                                <button class="btn-action btn-whatsapp" onclick="sendWhatsApp('${donor.mobile}')">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </button>
                                <button class="btn-action btn-view" onclick="viewDonorProfile('${donor.id}')">
                                    <i class="fas fa-eye"></i> View
                                </button>
                                <button class="btn-action btn-report" onclick="reportDonor('${donor.id}')">
                                    <i class="fas fa-flag"></i> Report
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            `).join('');
        };

    
        window.resetFilters = function() {
            document.getElementById('searchBloodGroup').value = '';
            document.getElementById('searchDistrict').value = '';
            document.getElementById('searchUpazila').value = '';
            document.getElementById('searchArea').value = '';
            document.getElementById('availableOnly').checked = false;
            document.getElementById('donorResults').innerHTML = `
                <div class="col-12">
                    <div class="empty-state">
                        <div class="empty-icon"><i class="fas fa-search"></i></div>
                        <div class="empty-title">Start Searching</div>
                        <div class="empty-text">Use the filters on the left to find available blood donors.</div>
                    </div>
                </div>
            `;
        };


        window.callDonor = function(mobile) {
            window.location.href = `tel:${mobile}`;
        };

  
        window.sendWhatsApp = function(mobile) {
            window.location.href = `https://wa.me/${mobile.replace('+', '')}?text=Hi%20I%20need%20blood%20donation`;
        };

    
        window.viewDonorProfile = function(donorId) {
            const donor = allDonors.find(d => d.id === donorId);
            if (!donor) return;

            const modal = document.getElementById('donorModal');
            document.getElementById('modalDonorName').textContent = donor.name;
            document.getElementById('modalDonorBody').innerHTML = `
                <div style="text-align: center; margin-bottom: 2rem;">
                    ${donor.photoURL ? `<img src="${donor.photoURL}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">` : '<div style="width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: white; font-size: 2rem;"><i class="fas fa-user"></i></div>'}
                </div>
                <div style="margin-bottom: 1.5rem;">
                    <p><strong>Blood Group:</strong> <span class="donor-blood-badge">${donor.bloodGroup}</span></p>
                    <p><strong>District:</strong> ${donor.district}</p>
                    <p><strong>Upazila:</strong> ${donor.upazila}</p>
                    <p><strong>Area:</strong> ${donor.area}</p>
                    <p><strong>Gender:</strong> ${donor.gender}</p>
                    ${donor.lastDonationDate ? `<p><strong>Last Donation:</strong> ${new Date(donor.lastDonationDate).toLocaleDateString()}</p>` : ''}
                    <p><strong>Status:</strong> <span class="status-badge ${donor.isAvailable ? 'status-available' : 'status-unavailable'}">${donor.isAvailable ? 'Available' : 'Not Available'}</span></p>
                    ${donor.isVerified ? `<p><span class="status-badge status-verified"><i class="fas fa-check"></i> Verified Donor</span></p>` : ''}
                    <p><strong>Joined:</strong> ${new Date(donor.createdAt).toLocaleDateString()}</p>
                </div>
                <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; gap: 0.5rem; flex-direction: column;">
                    <button class="btn-action btn-call" style="display: flex; justify-content: center;" onclick="callDonor('${donor.mobile}')">
                        <i class="fas fa-phone"></i> Call ${donor.name}
                    </button>
                    <button class="btn-action btn-whatsapp" style="display: flex; justify-content: center;" onclick="sendWhatsApp('${donor.mobile}')">
                        <i class="fab fa-whatsapp"></i> Message on WhatsApp
                    </button>
                </div>
            `;
            modal.classList.add('active');
        };

        window.reportDonor = function(donorId) {
            if (!currentUser) {
                showToast('Please log in to report', 'error');
                return;
            }

            const reason = prompt('Please provide a reason for reporting this donor:');
            if (!reason) return;

            const reportData = {
                reporterUid: currentUser.uid,
                donorId: donorId,
                reason: reason,
                status: 'Pending',
                createdAt: new Date().toISOString()
            };

            push(ref(database, 'reports'), reportData).then(() => {
                showToast('Report submitted. Thank you for helping us keep the community safe.', 'success');
            }).catch(error => {
                showToast('Error submitting report: ' + error.message, 'error');
            });
        };

        window.closeDonorModal = function() {
            document.getElementById('donorModal').classList.remove('active');
        };

   
        window.loadEmergencyRequests = function() {
            const emergencyList = document.getElementById('emergencyList');

            onValue(ref(database, 'bloodRequests'), (snapshot) => {
                const requests = [];
                snapshot.forEach((child) => {
                    requests.push({ id: child.key, ...child.val() });
                });

                requests.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

                if (requests.length === 0) {
                    emergencyList.innerHTML = `
                        <div class="empty-state">
                            <div class="empty-icon"><i class="fas fa-inbox"></i></div>
                            <div class="empty-text">No emergency requests at the moment</div>
                        </div>
                    `;
                    return;
                }

                emergencyList.innerHTML = requests.map(req => `
                    <div class="card mb-3">
                        <div class="card-body">
                            <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
                                <div>
                                    <h5 style="margin-bottom: 0.5rem;">${req.patientName}</h5>
                                    <span class="donor-blood-badge">${req.bloodGroup}</span>
                                    <span class="badge-custom badge-${req.urgencyLevel.toLowerCase()}" style="margin-left: 0.5rem;">${req.urgencyLevel}</span>
                                </div>
                            </div>
                            <div style="color: var(--text-light); font-size: 0.9rem; margin-bottom: 1rem;">
                                <p style="margin-bottom: 0.3rem;"><i class="fas fa-hospital-user"></i> ${req.hospitalName}</p>
                                <p style="margin-bottom: 0.3rem;"><i class="fas fa-map-marker-alt"></i> ${req.district}, ${req.location}</p>
                                <p style="margin-bottom: 0.3rem;"><i class="fas fa-droplet"></i> ${req.bagsRequired} Blood Bag${req.bagsRequired > 1 ? 's' : ''} Required</p>
                                <p style="margin-bottom: 0.3rem;"><i class="fas fa-calendar"></i> Needed by: ${new Date(req.requiredDate).toLocaleDateString()}</p>
                                <p style="margin-bottom: 0.3rem;"><i class="fas fa-phone"></i> ${req.contactNumber}</p>
                            </div>
                            ${req.message ? `<p style="font-size: 0.9rem; margin-bottom: 1rem; padding: 0.75rem; background: #f9f9f9; border-radius: 6px;">${req.message}</p>` : ''}
                            <div style="border-top: 1px solid var(--border-color); padding-top: 1rem; display: flex; gap: 0.5rem;">
                                <button class="btn-action btn-call" style="flex: 1; justify-content: center;" onclick="callDonor('${req.contactNumber}')">
                                    <i class="fas fa-phone"></i> Call
                                </button>
                                <button class="btn-action btn-whatsapp" style="flex: 1; justify-content: center;" onclick="sendWhatsApp('${req.contactNumber}')">
                                    <i class="fab fa-whatsapp"></i> WhatsApp
                                </button>
                            </div>
                        </div>
                    </div>
                `).join('');
            });
        };

      
        window.getNearbyDonors = function() {
            if (!navigator.geolocation) {
                showToast('Geolocation is not supported by your browser', 'error');
                return;
            }

            document.getElementById('nearbyResults').innerHTML = `
                <div class="col-12">
                    <div class="loading-container">
                        <div class="spinner"></div>
                    </div>
                </div>
            `;

            navigator.geolocation.getCurrentPosition(
                (position) => {
                    const userLat = position.coords.latitude;
                    const userLon = position.coords.longitude;

                    
                    const nearby = allDonors.map(donor => {
                   
                        return donor;
                    }).filter(d => d.isAvailable).slice(0, 6);

                    if (nearby.length === 0) {
                        document.getElementById('nearbyResults').innerHTML = `
                            <div class="col-12">
                                <div class="empty-state">
                                    <div class="empty-icon"><i class="fas fa-map"></i></div>
                                    <div class="empty-title">No Nearby Donors</div>
                                    <div class="empty-text">Unfortunately, there are no available donors near you at this time.</div>
                                </div>
                            </div>
                        `;
                        return;
                    }

                    displayDonorResults(nearby);
                },
                (error) => {
                    showToast('Unable to get your location. Please check your permissions.', 'error');
                    console.error(error);
                }
            );
        };

        // Load User Dashboard
        window.loadUserDashboard = async function() {
            if (!currentUser) return;

            try {
                const donorRef = ref(database, `donors/${currentUser.uid}`);
                onValue(donorRef, (snapshot) => {
                    const donor = snapshot.val();
                    if (!donor) {
                        document.getElementById('profileInfo').innerHTML = `
                            <p>No donor profile found. <a href="#" onclick="showSection('becomeDonor')">Create one now</a></p>
                        `;
                        return;
                    }

                    document.getElementById('dashboardDonorStatus').textContent = donor.isAvailable ? 'Available' : 'Not Available';
                    document.getElementById('dashboardBloodGroup').textContent = donor.bloodGroup;
                    document.getElementById('dashboardLastDonation').textContent = donor.lastDonationDate ? new Date(donor.lastDonationDate).toLocaleDateString() : 'Never';

                    // Set availability radio
                    if (donor.isAvailable) {
                        document.getElementById('availableYes').checked = true;
                    } else {
                        document.getElementById('availableNo').checked = true;
                    }

                    document.getElementById('profileInfo').innerHTML = `
                        <div style="text-align: center; margin-bottom: 2rem;">
                            ${donor.photoURL ? `<img src="${donor.photoURL}" style="width: 100px; height: 100px; border-radius: 50%; object-fit: cover;">` : '<div style="width: 100px; height: 100px; background: linear-gradient(135deg, var(--primary) 0%, var(--primary-dark) 100%); border-radius: 50%; display: flex; align-items: center; justify-content: center; margin: 0 auto; color: white; font-size: 2rem;"><i class="fas fa-user"></i></div>'}
                        </div>
                        <p><strong>Name:</strong> ${donor.name}</p>
                        <p><strong>Blood Group:</strong> ${donor.bloodGroup}</p>
                        <p><strong>Mobile:</strong> ${donor.mobile}</p>
                        <p><strong>District:</strong> ${donor.district}</p>
                        <p><strong>Upazila:</strong> ${donor.upazila}</p>
                        <p><strong>Area:</strong> ${donor.area}</p>
                        <p><strong>Joined:</strong> ${new Date(donor.createdAt).toLocaleDateString()}</p>
                        ${donor.isVerified ? '<p><span class="status-badge status-verified"><i class="fas fa-check"></i> Verified</span></p>' : ''}
                    `;
                });
            } catch (error) {
                console.error('Error loading dashboard:', error);
            }
        };

        // Update Availability
        window.updateAvailability = async function() {
            if (!currentUser) return;

            const isAvailable = document.getElementById('availableYes').checked;

            try {
                await update(ref(database, `donors/${currentUser.uid}`), {
                    isAvailable: isAvailable
                });
                showToast(isAvailable ? 'You are now marked as available' : 'You are now marked as not available', 'success');
            } catch (error) {
                showToast('Error updating availability: ' + error.message, 'error');
            }
        };

        // Admin Functions
        window.switchAdminTab = function(tab, evt) {
            document.querySelectorAll('.admin-tab').forEach(t => t.classList.remove('active'));
            document.querySelectorAll('.admin-tab-content').forEach(c => c.style.display = 'none');

            if (evt && evt.currentTarget) {
                evt.currentTarget.classList.add('active');
            }
            document.getElementById(`admin${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`).style.display = 'block';
        };

        // Load Admin Donors
        window.loadAdminDonors = async function() {
            if (!currentUserData?.isAdmin) return;

            const bloodFilter = document.getElementById('adminBloodFilter').value;
            const districtFilter = document.getElementById('adminDistrictFilter').value;

            let filtered = allDonors;

            if (bloodFilter) {
                filtered = filtered.filter(d => d.bloodGroup === bloodFilter);
            }
            if (districtFilter) {
                filtered = filtered.filter(d => d.district === districtFilter);
            }

            const tbody = document.getElementById('adminDonorsBody');
            tbody.innerHTML = filtered.map(donor => `
                <tr>
                    <td>${donor.name}</td>
                    <td><span class="donor-blood-badge">${donor.bloodGroup}</span></td>
                    <td>${donor.district}</td>
                    <td>${donor.mobile}</td>
                    <td>${donor.isVerified ? '<span class="status-badge status-verified">Yes</span>' : 'No'}</td>
                    <td>${donor.isAvailable ? '<span class="status-badge status-available">Yes</span>' : 'No'}</td>
                    <td>
                        ${!donor.isVerified ? `<button class="admin-action-btn admin-verify" onclick="verifyDonor('${donor.id}')">Verify</button>` : ''}
                        <button class="admin-action-btn admin-delete" onclick="deleteDonor('${donor.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');

            if (filtered.length === 0) {
                tbody.innerHTML = '<tr><td colspan="7" class="text-center">No donors found</td></tr>';
            }
        };

        // Verify Donor
        window.verifyDonor = async function(donorId) {
            try {
                await update(ref(database, `donors/${donorId}`), {
                    isVerified: true
                });
                showToast('Donor verified successfully', 'success');
                loadAdminDonors();
            } catch (error) {
                showToast('Error verifying donor: ' + error.message, 'error');
            }
        };

        // Delete Donor
        window.deleteDonor = async function(donorId) {
            if (!confirm('Are you sure you want to delete this donor?')) return;

            try {
                await remove(ref(database, `donors/${donorId}`));
                showToast('Donor deleted successfully', 'success');
                loadAdminDonors();
            } catch (error) {
                showToast('Error deleting donor: ' + error.message, 'error');
            }
        };

        // Load Admin Requests
        window.loadAdminRequests = async function() {
            if (!currentUserData?.isAdmin) return;

            const tbody = document.getElementById('adminRequestsBody');
            tbody.innerHTML = allRequests.map(req => `
                <tr>
                    <td>${req.patientName}</td>
                    <td><span class="donor-blood-badge">${req.bloodGroup}</span></td>
                    <td>${req.hospitalName}</td>
                    <td>${req.location}</td>
                    <td><span class="badge-custom badge-${req.urgencyLevel.toLowerCase()}">${req.urgencyLevel}</span></td>
                    <td>${new Date(req.requiredDate).toLocaleDateString()}</td>
                    <td>${req.status}</td>
                    <td>
                        ${req.status === 'Open' ? `<button class="admin-action-btn admin-verify" onclick="markFulfilled('${req.id}')">Mark Fulfilled</button>` : ''}
                        <button class="admin-action-btn admin-delete" onclick="deleteRequest('${req.id}')">Delete</button>
                    </td>
                </tr>
            `).join('');

            if (allRequests.length === 0) {
                tbody.innerHTML = '<tr><td colspan="8" class="text-center">No requests found</td></tr>';
            }
        };

        // Mark Fulfilled
        window.markFulfilled = async function(requestId) {
            try {
                await update(ref(database, `bloodRequests/${requestId}`), {
                    status: 'Fulfilled'
                });
                showToast('Request marked as fulfilled', 'success');
                loadAdminRequests();
            } catch (error) {
                showToast('Error updating request: ' + error.message, 'error');
            }
        };

        // Delete Request
        window.deleteRequest = async function(requestId) {
            if (!confirm('Are you sure you want to delete this request?')) return;

            try {
                await remove(ref(database, `bloodRequests/${requestId}`));
                showToast('Request deleted successfully', 'success');
                loadAdminRequests();
            } catch (error) {
                showToast('Error deleting request: ' + error.message, 'error');
            }
        };

        // Load Admin Users
        window.loadAdminUsers = async function() {
            if (!currentUserData?.isAdmin) return;

            try {
                const snapshot = await get(ref(database, 'users'));
                allUsers = [];
                snapshot.forEach((child) => {
                    allUsers.push({ id: child.key, ...child.val() });
                });

                const tbody = document.getElementById('adminUsersBody');
                tbody.innerHTML = allUsers.map(u => `
                    <tr>
                        <td>${u.email || '-'}</td>
                        <td style="font-size: 0.8rem;">${u.id}</td>
                        <td>${u.isAdmin ? '<span class="status-badge status-verified">Admin</span>' : '<span class="status-badge status-available">User</span>'}</td>
                        <td>${u.createdAt ? new Date(u.createdAt).toLocaleDateString() : '-'}</td>
                        <td>
                            ${u.id !== currentUser.uid ? `<button class="admin-action-btn ${u.isAdmin ? 'admin-block' : 'admin-verify'}" onclick="toggleAdmin('${u.id}', ${!u.isAdmin})">${u.isAdmin ? 'Remove Admin' : 'Make Admin'}</button>` : '<span class="text-muted">You</span>'}
                        </td>
                    </tr>
                `).join('');

                if (allUsers.length === 0) {
                    tbody.innerHTML = '<tr><td colspan="5" class="text-center">No users found</td></tr>';
                }
            } catch (error) {
                console.error('Error loading users:', error);
                showToast('Error loading users: ' + error.message, 'error');
            }
        };

        // Toggle Admin (only works because the security rules allow an
        // existing admin to change isAdmin on ANY user's record)
        window.toggleAdmin = async function(uid, makeAdmin) {
            if (!confirm(`${makeAdmin ? 'Grant' : 'Remove'} admin access for this user?`)) return;

            try {
                await update(ref(database, `users/${uid}`), {
                    isAdmin: makeAdmin
                });
                showToast(`Admin access ${makeAdmin ? 'granted' : 'removed'}`, 'success');
                loadAdminUsers();
            } catch (error) {
                showToast('Error updating admin status: ' + error.message, 'error');
            }
        };

        // Load Admin Statistics
        window.loadAdminStats = async function() {
            const bloodGroupStats = {};
            const districtStats = {};

            allDonors.forEach(donor => {
                bloodGroupStats[donor.bloodGroup] = (bloodGroupStats[donor.bloodGroup] || 0) + 1;
                districtStats[donor.district] = (districtStats[donor.district] || 0) + 1;
            });

            // Update cards
            document.getElementById('statTotalDonors').textContent = allDonors.length;
            document.getElementById('statAvailableDonors').textContent = allDonors.filter(d => d.isAvailable).length;
            document.getElementById('statTotalRequests').textContent = allRequests.length;
            document.getElementById('statEmergencyRequests').textContent = allRequests.filter(r => r.urgencyLevel === 'Critical' || r.urgencyLevel === 'Urgent').length;

            // Blood Group Stats
            const bloodGroupHtml = Object.entries(bloodGroupStats).map(([group, count]) => `
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>${group}</span>
                    <strong>${count}</strong>
                </div>
            `).join('');
            document.getElementById('bloodGroupStats').innerHTML = bloodGroupHtml || '<p>No data</p>';

            // District Stats
            const districtHtml = Object.entries(districtStats).map(([district, count]) => `
                <div style="margin-bottom: 0.5rem; display: flex; justify-content: space-between;">
                    <span>${district}</span>
                    <strong>${count}</strong>
                </div>
            `).join('');
            document.getElementById('districtStats').innerHTML = districtHtml || '<p>No data</p>';
        };

        // Toast Notification
        window.showToast = function(message, type = 'info') {
            const container = document.getElementById('toastContainer');
            const toast = document.createElement('div');
            toast.className = `toast ${type}`;
            toast.innerHTML = `
                <div class="toast-icon">
                    ${type === 'success' ? '<i class="fas fa-check-circle"></i>' : type === 'error' ? '<i class="fas fa-exclamation-circle"></i>' : '<i class="fas fa-info-circle"></i>'}
                </div>
                <div>${message}</div>
                <button class="toast-close" onclick="this.parentElement.remove()">&times;</button>
            `;
            container.appendChild(toast);

            setTimeout(() => {
                if (toast.parentElement) {
                    toast.remove();
                }
            }, 5000);
        };

        // Initial Load
        window.addEventListener('load', () => {
            loadHomeStatistics();
            loadDistrictCounts();
        });
 