import { createClient } from '@supabase/supabase-js'

// Supabase connection
const supabaseUrl = 'https://togfwlwthtllzwmoclsz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2Z3bHd0aHRsbHp3bW9jbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzA5MDYsImV4cCI6MjA3OTkwNjkwNn0.n0br_yh9IWxIq_iDxLa5cO-A3G5K9dScYdaaTXAOEnM'
const supabase = createClient(supabaseUrl, supabaseKey)

// Load companies when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadCompanies()
})

// Load and display companies
async function loadCompanies() {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .is('deleted_at', null)
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error loading companies:', error)
        return
    }

    const tbody = document.querySelector('#companiesTable tbody')
    tbody.innerHTML = ''

    data.forEach(company => {
        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${company.company_id}</td>
            <td>${company.company_name}</td>
            <td>${company.dba_name}</td>
            <td>${company.company_phone}</td>
            <td>${company.address_line1}${company.address_line2 ? ', ' + company.address_line2 : ''}</td>
            <td>${company.city}</td>
            <td>${company.state}</td>
            <td>${company.zip}</td>
            <td>${company.created_by}</td>
            <td>${new Date(company.created_at).toLocaleString()}</td>
            <td>${company.modified_by}</td>
            <td>${new Date(company.modified_at).toLocaleString()}</td>
            <td>
                <button class="btn-view" onclick="viewCompany('${company.id}')">View</button>
                <button class="btn-edit" onclick="editCompany('${company.id}')">Edit</button>
                <button class="btn-delete" onclick="deleteCompany('${company.id}')">Delete</button>
            </td>
        `
        tbody.appendChild(row)
    })
}

// Show add company form
window.showAddCompany = function() {
    document.getElementById('companiesView').classList.add('hidden')
    document.getElementById('addCompanyView').classList.remove('hidden')
}

// Show companies list
window.showCompanies = function() {
    document.getElementById('addCompanyView').classList.add('hidden')
    document.getElementById('companiesView').classList.remove('hidden')
    clearForm()
}

// Check if company name is filled
window.checkCompanyName = function() {
    const companyName = document.getElementById('companyName').value.trim()
    const dbaSection = document.getElementById('dbaSection')

    if (companyName.length > 0) {
        dbaSection.classList.remove('hidden')
    } else {
        dbaSection.classList.add('hidden')
        document.getElementById('restOfFields').classList.add('hidden')
        document.getElementById('cancelOnly').classList.remove('hidden')
        document.getElementById('hasDba').value = ''
        document.getElementById('dbaName').value = ''
    }
}

// Handle DBA change
window.handleDbaChange = function() {
    const hasDba = document.getElementById('hasDba').value
    const companyName = document.getElementById('companyName').value.trim()
    const dbaField = document.getElementById('dbaName')
    const dbaNameRow = document.getElementById('dbaNameRow')
    const restOfFields = document.getElementById('restOfFields')
    const cancelOnly = document.getElementById('cancelOnly')

    if (hasDba === 'No') {
        dbaField.value = companyName
        dbaField.readOnly = true
        dbaField.style.backgroundColor = '#f0f0f0'
        dbaNameRow.classList.remove('hidden')
        restOfFields.classList.remove('hidden')
        cancelOnly.classList.add('hidden')
    } else if (hasDba === 'Yes') {
        dbaField.value = ''
        dbaField.readOnly = false
        dbaField.style.backgroundColor = 'white'
        dbaNameRow.classList.remove('hidden')
        restOfFields.classList.remove('hidden')
        cancelOnly.classList.add('hidden')
    } else {
        dbaNameRow.classList.add('hidden')
        restOfFields.classList.add('hidden')
        cancelOnly.classList.remove('hidden')
    }
}

// Save company
window.saveCompany = async function() {
    // If editing, call update instead
    if (window.editingCompanyId) {
        updateCompany()
        return
    }
    const companyName = document.getElementById('companyName').value.trim()
    const hasDba = document.getElementById('hasDba').value
    const dbaName = document.getElementById('dbaName').value.trim()
    const companyPhone = document.getElementById('companyPhone').value.trim()
    const addressLine1 = document.getElementById('addressLine1').value.trim()
    const addressLine2 = document.getElementById('addressLine2').value.trim()
    const city = document.getElementById('city').value.trim()
    const state = document.getElementById('state').value
    const zip = document.getElementById('zip').value.trim()

    // Validation
    if (!companyName) { alert('Company Name is required.'); return }
    if (!hasDba) { alert('Please select if company uses DBA.'); return }
    if (!dbaName) { alert('DBA Name is required.'); return }
    if (!companyPhone) { alert('Company Phone is required.'); return }
    if (!addressLine1) { alert('Address Line 1 is required.'); return }
    if (!city) { alert('City is required.'); return }
    if (!state) { alert('State is required.'); return }
    if (!/^\d{5}$/.test(zip)) { alert('Zip Code must be exactly 5 digits.'); return }

    // Generate company ID
    const companyId = generateCompanyId()

    const { error } = await supabase
        .from('companies')
        .insert({
            company_id: companyId,
            company_name: companyName,
            has_dba: hasDba,
            dba_name: dbaName,
            company_phone: companyPhone,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            zip: zip,
            created_by: 'Admin',
            modified_by: 'Admin'
        })

    if (error) {
        alert('Error saving company: ' + error.message)
        return
    }

    alert('Company saved successfully!')
    showCompanies()
    loadCompanies()
}

// Generate company ID (format: XXXX-XXX-XXXX)
function generateCompanyId() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let id = ''
    for (let i = 0; i < 4; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
    id += '-'
    for (let i = 0; i < 3; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
    id += '-'
    for (let i = 0; i < 4; i++) id += chars.charAt(Math.floor(Math.random() * chars.length))
    return id
}

// Clear form
function clearForm() {
    document.getElementById('companyName').value = ''
    document.getElementById('hasDba').value = ''
    document.getElementById('dbaName').value = ''
    document.getElementById('companyPhone').value = ''
    document.getElementById('addressLine1').value = ''
    document.getElementById('addressLine2').value = ''
    document.getElementById('city').value = ''
    document.getElementById('state').value = ''
    document.getElementById('zip').value = ''

    const dbaField = document.getElementById('dbaName')
    dbaField.readOnly = false
    dbaField.style.backgroundColor = 'white'

    // Reset visibility
    document.getElementById('dbaSection').classList.add('hidden')
    document.getElementById('dbaNameRow').classList.add('hidden')
    document.getElementById('restOfFields').classList.add('hidden')
    document.getElementById('cancelOnly').classList.remove('hidden')
}

// Auto-format phone number as (###) ###-####
window.formatPhoneNumber = function(input) {
    let value = input.value.replace(/\D/g, '') // Remove all non-digits

    if (value.length > 10) {
        value = value.substring(0, 10) // Limit to 10 digits
    }

    if (value.length > 6) {
        input.value = '(' + value.substring(0, 3) + ') ' + value.substring(3, 6) + '-' + value.substring(6)
    } else if (value.length > 3) {
        input.value = '(' + value.substring(0, 3) + ') ' + value.substring(3)
    } else if (value.length > 0) {
        input.value = '(' + value
    } else {
        input.value = ''
    }
}
// Soft delete company
window.deleteCompany = async function(id) {
    if (!confirm('Are you sure you want to delete this company? You can restore it within 30 days.')) {
        return
    }

    const { error } = await supabase
        .from('companies')
        .update({ deleted_at: new Date().toISOString() })
        .eq('id', id)

    if (error) {
        alert('Error deleting company: ' + error.message)
        return
    }

    alert('Company deleted. You can restore it from the Deleted Items within 30 days.')
    loadCompanies()
}
// View company
window.viewCompany = async function(id) {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        alert('Error loading company: ' + error.message)
        return
    }

    // Populate view fields
    document.getElementById('viewCompanyId').textContent = data.company_id
    document.getElementById('viewCompanyName').textContent = data.company_name
    document.getElementById('viewHasDba').textContent = data.has_dba
    document.getElementById('viewDbaName').textContent = data.dba_name
    document.getElementById('viewPhone').textContent = data.company_phone
    document.getElementById('viewAddress1').textContent = data.address_line1
    document.getElementById('viewAddress2').textContent = data.address_line2 || '-'
    document.getElementById('viewCity').textContent = data.city
    document.getElementById('viewState').textContent = data.state
    document.getElementById('viewZip').textContent = data.zip
    document.getElementById('viewCreatedBy').textContent = data.created_by
    document.getElementById('viewCreatedAt').textContent = new Date(data.created_at).toLocaleString()
    document.getElementById('viewModifiedBy').textContent = data.modified_by
    document.getElementById('viewModifiedAt').textContent = new Date(data.modified_at).toLocaleString()

    // Store current company id for edit button
    window.currentViewCompanyId = id

    // Show view screen
    document.getElementById('companiesView').classList.add('hidden')
    document.getElementById('addCompanyView').classList.add('hidden')
    document.getElementById('viewCompanyView').classList.remove('hidden')
}

// Edit from view screen
window.editCompanyFromView = function() {
    editCompany(window.currentViewCompanyId)
}
// Edit company
window.editCompany = async function(id) {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        alert('Error loading company: ' + error.message)
        return
    }

    // Store the id for updating
    window.editingCompanyId = id

    // Populate form fields
    document.getElementById('companyName').value = data.company_name
    document.getElementById('hasDba').value = data.has_dba
    document.getElementById('dbaName').value = data.dba_name
    document.getElementById('companyPhone').value = data.company_phone
    document.getElementById('addressLine1').value = data.address_line1
    document.getElementById('addressLine2').value = data.address_line2 || ''
    document.getElementById('city').value = data.city
    document.getElementById('state').value = data.state
    document.getElementById('zip').value = data.zip

    // Handle DBA field styling
    if (data.has_dba === 'No') {
        document.getElementById('dbaName').readOnly = true
        document.getElementById('dbaName').style.backgroundColor = '#f0f0f0'
    }

    // Show all form sections
    document.getElementById('dbaSection').classList.remove('hidden')
    document.getElementById('dbaNameRow').classList.remove('hidden')
    document.getElementById('restOfFields').classList.remove('hidden')
    document.getElementById('cancelOnly').classList.add('hidden')

    // Change form title and button
    document.querySelector('#addCompanyView h2').textContent = 'Edit Company'

    // Show edit form
    document.getElementById('companiesView').classList.add('hidden')
    document.getElementById('viewCompanyView').classList.add('hidden')
    document.getElementById('addCompanyView').classList.remove('hidden')
}

// Update company (modify the saveCompany function)
window.updateCompany = async function() {
    const companyName = document.getElementById('companyName').value.trim()
    const hasDba = document.getElementById('hasDba').value
    const dbaName = document.getElementById('dbaName').value.trim()
    const companyPhone = document.getElementById('companyPhone').value.trim()
    const addressLine1 = document.getElementById('addressLine1').value.trim()
    const addressLine2 = document.getElementById('addressLine2').value.trim()
    const city = document.getElementById('city').value.trim()
    const state = document.getElementById('state').value
    const zip = document.getElementById('zip').value.trim()

    // Validation
    if (!companyName) { alert('Company Name is required.'); return }
    if (!hasDba) { alert('Please select if company uses DBA.'); return }
    if (!dbaName) { alert('DBA Name is required.'); return }
    if (!companyPhone) { alert('Company Phone is required.'); return }
    if (!addressLine1) { alert('Address Line 1 is required.'); return }
    if (!city) { alert('City is required.'); return }
    if (!state) { alert('State is required.'); return }
    if (!/^\d{5}$/.test(zip)) { alert('Zip Code must be exactly 5 digits.'); return }

    const { error } = await supabase
        .from('companies')
        .update({
            company_name: companyName,
            has_dba: hasDba,
            dba_name: dbaName,
            company_phone: companyPhone,
            address_line1: addressLine1,
            address_line2: addressLine2,
            city: city,
            state: state,
            zip: zip,
            modified_by: 'Admin',
            modified_at: new Date().toISOString()
        })
        .eq('id', window.editingCompanyId)

    if (error) {
        alert('Error updating company: ' + error.message)
        return
    }

    alert('Company updated successfully!')
    window.editingCompanyId = null
    document.querySelector('#addCompanyView h2').textContent = 'Add New Company'
    showCompanies()
    loadCompanies()
}
// Restore deleted company
window.restoreCompany = async function(id) {
    const { error } = await supabase
        .from('companies')
        .update({ deleted_at: null })
        .eq('id', id)

    if (error) {
        alert('Error restoring company: ' + error.message)
        return
    }

    alert('Company restored successfully!')
    showCompaniesFromDeleted()
    loadCompanies()
}

// Permanently delete company
window.permanentlyDeleteCompany = async function(id) {
    if (!confirm('Are you sure you want to PERMANENTLY delete this company? This cannot be undone.')) {
        return
    }

    const { error } = await supabase
        .from('companies')
        .delete()
        .eq('id', id)

    if (error) {
        alert('Error deleting company: ' + error.message)
        return
    }

    alert('Company permanently deleted.')
    showCompaniesFromDeleted()
    loadCompanies()
}

// Load deleted companies
async function loadDeletedCompanies() {
    const { data, error } = await supabase
        .from('companies')
        .select('*')
        .not('deleted_at', 'is', null)
        .order('deleted_at', { ascending: false })

    if (error) {
        console.error('Error loading deleted companies:', error)
        return
    }

    const tbody = document.querySelector('#deletedTable tbody')
    if (!tbody) return

    tbody.innerHTML = ''

    data.forEach(company => {
        const deletedDate = new Date(company.deleted_at)
        const expiryDate = new Date(deletedDate.getTime() + 30 * 24 * 60 * 60 * 1000)
        const daysLeft = Math.ceil((expiryDate - new Date()) / (24 * 60 * 60 * 1000))

        const row = document.createElement('tr')
        row.innerHTML = `
            <td>${company.company_name}</td>
            <td>${new Date(company.deleted_at).toLocaleString()}</td>
            <td>${daysLeft} days</td>
            <td>
                <button class="btn-restore" onclick="restoreCompany('${company.id}')">Restore</button>
                <button class="btn-delete" onclick="permanentlyDeleteCompany('${company.id}')">Delete Forever</button>
            </td>
        `
        tbody.appendChild(row)
    })
}

// Show deleted items view
window.showDeletedItems = function() {
    document.getElementById('companiesView').classList.add('hidden')
    document.getElementById('addCompanyView').classList.add('hidden')
    document.getElementById('viewCompanyView').classList.add('hidden')
    document.getElementById('deletedItemsView').classList.remove('hidden')
    loadDeletedCompanies()
}

// Show companies from deleted view
window.showCompaniesFromDeleted = function() {
    document.getElementById('deletedItemsView').classList.add('hidden')
    document.getElementById('companiesView').classList.remove('hidden')
}