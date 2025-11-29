import { createClient } from '@supabase/supabase-js'

// Supabase connection
const supabaseUrl = 'https://togfwlwthtllzwmoclsz.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRvZ2Z3bHd0aHRsbHp3bW9jbHN6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjQzMzA5MDYsImV4cCI6MjA3OTkwNjkwNn0.n0br_yh9IWxIq_iDxLa5cO-A3G5K9dScYdaaTXAOEnM'
const supabase = createClient(supabaseUrl, supabaseKey)

// Load deleted companies when page loads
document.addEventListener('DOMContentLoaded', () => {
    loadDeletedCompanies()
})

// Load and display deleted companies
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
    tbody.innerHTML = ''

    if (data.length === 0) {
        tbody.innerHTML = '<tr><td colspan="4" style="text-align: center;">No deleted companies</td></tr>'
        return
    }

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
    window.location.href = '/'
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
    window.location.href = '/'
}