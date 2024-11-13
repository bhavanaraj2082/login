import { writable } from 'svelte/store';
export const solutionType = writable('');
export const formatType = writable('');
export const formData = writable({
    components: [],
    solvent: '',
    packagingType: '',
    volume: '',
    units: 0,
    qualityLevel: '',
    analyticalTechnique: '',
});
export const AddNoted = writable('');
export const Cusdetails = writable({
    Title: '',
    First: '',
    Last: '',
    Organisation: '',
    Country: '',
    LGC: '',
    Email: '',
    Number: '',
});
export const Delivery = writable({
    Address1: '',
    Address2: '',
    Country: '',
    County: '',
    City: '',
    Post: '',
});
export function resetFormData() {
    solutionType.set('');
    formatType.set('');
    formData.set({
        components: [],
        solvent: '',
        packagingType: '',
        volume: '',
        units: 0,
        qualityLevel: '',
        analyticalTechnique: '',
    });
    AddNoted.set('');
    Cusdetails.set({
        Title: '',
        First: '',
        Last: '',
        Organisation: '',
        Country: '',
        LGC: '',
        Email: '',
        Number: '',
    });
    Delivery.set({
        Address1: '',
        Address2: '',
        Country: '',
        County: '',
        City: '',
        Post: '',
    });
}