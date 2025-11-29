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

// Navigate to view company page
window.viewCompany = function(id) {
    window.location.href = '/pages/company/view-company.html?id=' + id
}

// Navigate to edit company page
window.editCompany = function(id) {
    window.location.href = '/pages/company/edit-company.html?id=' + id
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