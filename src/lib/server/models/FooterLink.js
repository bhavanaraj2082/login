import mongoose from 'mongoose';

const footerLinkSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true,
            trim: true
        },
        link: {
            type: String,
            required: true,
            trim: true
        }
    },
    {
        timestamps: true,
        collection: 'footerlinks'
    }
);

const FooterLink = mongoose.models.FooterLink || mongoose.model('FooterLink', footerLinkSchema);

export default FooterLink;