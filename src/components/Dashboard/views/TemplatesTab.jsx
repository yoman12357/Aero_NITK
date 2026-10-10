import React, { useState, useEffect } from 'react';
import {
    FaPlus,
    FaTrash,
    FaEdit,
    FaCopy,
    FaEye,
    FaArrowUp,
    FaArrowDown,
    FaCheck,
    FaTimes,
    FaFileAlt,
    FaUsers,
    FaUser
} from 'react-icons/fa';
import {
    BUILTIN_TEMPLATES,
    DEFAULT_BRANCHES,
    DEFAULT_YEARS,
    getLocalTemplates,
    saveLocalTemplate,
    deleteLocalTemplate,
    getCombinedTemplates,
    createFieldSlug
} from '../../../data/registrationTemplates.js';
import {
    getRegistrationTemplates,
    saveRegistrationTemplate,
    deleteRegistrationTemplate
} from '../../../firebase.js';

const FIELD_TYPES = [
    { value: 'text', label: 'Single-line Text' },
    { value: 'email', label: 'Email Address' },
    { value: 'tel', label: 'Phone / WhatsApp' },
    { value: 'number', label: 'Number' },
    { value: 'select', label: 'Dropdown Select' },
    { value: 'radio', label: 'Radio Buttons' },
    { value: 'checkbox', label: 'Checkbox' },
    { value: 'textarea', label: 'Multi-line Textarea' },
    { value: 'file', label: 'File / Screenshot Upload' }
];

const PRESET_CUSTOM_FIELDS = [
    {
        label: 'GitHub / Portfolio Link',
        type: 'text',
        required: false,
        placeholder: 'https://github.com/username'
    },
    {
        label: 'T-Shirt Size',
        type: 'select',
        required: true,
        options: ['S', 'M', 'L', 'XL', 'XXL']
    },
    {
        label: 'Prior Aero / RC Experience',
        type: 'select',
        required: false,
        options: ['Beginner (No experience)', 'Intermediate (Built model planes/drones)', 'Advanced (Piloted/Competed)']
    },
    {
        label: 'Dietary Preference',
        type: 'select',
        required: false,
        options: ['Vegetarian', 'Non-Vegetarian', 'Jain / Vegan']
    },
    {
        label: 'Emergency Contact Number',
        type: 'tel',
        required: true,
        placeholder: '10-digit emergency contact'
    },
    {
        label: 'College ID Proof / Image',
        type: 'file',
        required: false,
        helpText: 'Upload college ID card'
    }
];

export default function TemplatesTab({ onSelectTemplateForEvent }) {
    const [templates, setTemplates] = useState([]);
    const [loading, setLoading] = useState(true);
    const [activeFilter, setActiveFilter] = useState('all'); // 'all', 'builtin', 'custom'

    // Modal state for viewing / previewing
    const [previewTemplate, setPreviewTemplate] = useState(null);

    // Modal state for editing / creating
    const [isEditorOpen, setIsEditorOpen] = useState(false);
    const [editingTemplateId, setEditingTemplateId] = useState(null);
    const [editorTab, setEditorTab] = useState('fields'); // 'fields', 'preview'

    const [formTemplate, setFormTemplate] = useState({
        name: '',
        description: '',
        type: 'individual',
        hasPayment: false,
        defaultFee: 0,
        qrCodeImage: '',
        paymentAmount: '',
        paymentInstructions: '',
        fields: []
    });

    const [newOptionInput, setNewOptionInput] = useState({});

    // Handle admin uploading a QR code image for the template
    const handleQrImageUpload = (file) => {
        if (!file) return;
        const reader = new FileReader();
        reader.onload = (e) => {
            const dataUrl = e.target.result;
            // If image is large, compress it via canvas to stay within Firestore limits
            if (dataUrl.length > 200000) {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    const maxDim = 400;
                    const scale = Math.min(maxDim / img.width, maxDim / img.height, 1);
                    canvas.width = Math.round(img.width * scale);
                    canvas.height = Math.round(img.height * scale);
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
                    const compressed = canvas.toDataURL('image/jpeg', 0.72);
                    setFormTemplate((prev) => ({ ...prev, qrCodeImage: compressed }));
                };
                img.src = dataUrl;
            } else {
                setFormTemplate((prev) => ({ ...prev, qrCodeImage: dataUrl }));
            }
        };
        reader.readAsDataURL(file);
    };

    // Load templates from Firestore and localStorage
    const loadAllTemplates = async () => {
        setLoading(true);
        try {
            const firestoreList = await getRegistrationTemplates();
            const localList = getLocalTemplates();

            // Merge firestore with local
            const combinedMap = new Map();
            localList.forEach((t) => combinedMap.set(t.id, t));
            firestoreList.forEach((t) => combinedMap.set(t.id, t));

            const customTemplates = Array.from(combinedMap.values());
            const fullList = getCombinedTemplates(customTemplates);
            setTemplates(fullList);
        } catch (err) {
            console.error('Error loading templates:', err);
            setTemplates(getCombinedTemplates([]));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadAllTemplates();
    }, []);

    // Open Builder for a new template
    const handleOpenCreate = () => {
        setEditingTemplateId(null);
        setFormTemplate({
            name: '',
            description: '',
            type: 'individual',
            hasPayment: false,
            defaultFee: 0,
            qrCodeImage: '',
            paymentAmount: '',
            paymentInstructions: '',
            fields: [
                { id: 'name', label: 'Full Name', type: 'text', required: true, placeholder: 'Enter your full name' },
                { id: 'email', label: 'College Email ID (@nitk.edu.in)', type: 'email', required: true, placeholder: 'rollno@nitk.edu.in' },
                { id: 'rollNo', label: 'Roll Number', type: 'text', required: true, placeholder: 'e.g. 231CS101' },
                { id: 'phone', label: 'Phone Number', type: 'tel', required: true, placeholder: '10-digit mobile number' },
                { id: 'branch', label: 'Branch / Department', type: 'select', required: true, options: DEFAULT_BRANCHES },
                { id: 'year', label: 'Year of Study', type: 'select', required: true, options: DEFAULT_YEARS }
            ]
        });
        setEditorTab('fields');
        setIsEditorOpen(true);
    };

    // Open Builder prefilled from an existing template (Duplicate / Base)
    const handleDuplicate = (template) => {
        setEditingTemplateId(null);
        setFormTemplate({
            name: `${template.name} (Custom Copy)`,
            description: template.description || '',
            type: template.type || 'individual',
            hasPayment: Boolean(template.hasPayment),
            defaultFee: template.defaultFee || 0,
            qrCodeImage: template.qrCodeImage || '',
            paymentAmount: template.paymentAmount || '',
            paymentInstructions: template.paymentInstructions || '',
            fields: JSON.parse(JSON.stringify(template.fields || []))
        });
        setEditorTab('fields');
        setIsEditorOpen(true);
    };

    // Edit an existing custom template
    const handleEditCustom = (template) => {
        setEditingTemplateId(template.id);
        setFormTemplate({
            name: template.name,
            description: template.description || '',
            type: template.type || 'individual',
            hasPayment: Boolean(template.hasPayment),
            defaultFee: template.defaultFee || 0,
            qrCodeImage: template.qrCodeImage || '',
            paymentAmount: template.paymentAmount || '',
            paymentInstructions: template.paymentInstructions || '',
            fields: JSON.parse(JSON.stringify(template.fields || []))
        });
        setEditorTab('fields');
        setIsEditorOpen(true);
    };

    // Delete custom template
    const handleDelete = async (templateId, templateName) => {
        if (!window.confirm(`Are you sure you want to delete the template "${templateName}"? This action cannot be undone.`)) {
            return;
        }

        try {
            await deleteRegistrationTemplate(templateId);
            deleteLocalTemplate(templateId);
            setTemplates((prev) => prev.filter((t) => t.id !== templateId));
            alert('Template deleted successfully.');
        } catch (err) {
            console.error('Error deleting template:', err);
            deleteLocalTemplate(templateId);
            setTemplates((prev) => prev.filter((t) => t.id !== templateId));
        }
    };

    // Field manipulation in editor
    const handleAddField = (preset = null) => {
        const newField = preset
            ? {
                  id: createFieldSlug(preset.label),
                  label: preset.label,
                  type: preset.type,
                  required: Boolean(preset.required),
                  placeholder: preset.placeholder || '',
                  helpText: preset.helpText || '',
                  options: preset.options ? [...preset.options] : []
              }
            : {
                  id: `custom_field_${Date.now()}`,
                  label: 'New Field',
                  type: 'text',
                  required: false,
                  placeholder: '',
                  helpText: '',
                  options: []
              };

        setFormTemplate((prev) => ({
            ...prev,
            fields: [...prev.fields, newField]
        }));
    };

    const handleUpdateField = (index, updates) => {
        setFormTemplate((prev) => {
            const nextFields = [...prev.fields];
            const updatedField = { ...nextFields[index], ...updates };

            // If label changed and ID was auto-generated or matched old label, update ID
            if (updates.label && (!updatedField.id || updatedField.id.startsWith('custom_field_'))) {
                updatedField.id = createFieldSlug(updates.label);
            }

            nextFields[index] = updatedField;
            return { ...prev, fields: nextFields };
        });
    };

    const handleRemoveField = (index) => {
        setFormTemplate((prev) => ({
            ...prev,
            fields: prev.fields.filter((_, i) => i !== index)
        }));
    };

    const handleMoveField = (index, direction) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= formTemplate.fields.length) return;

        setFormTemplate((prev) => {
            const nextFields = [...prev.fields];
            const temp = nextFields[index];
            nextFields[index] = nextFields[targetIndex];
            nextFields[targetIndex] = temp;
            return { ...prev, fields: nextFields };
        });
    };

    const handleAddOptionToField = (fieldIndex) => {
        const text = (newOptionInput[fieldIndex] || '').trim();
        if (!text) return;

        setFormTemplate((prev) => {
            const nextFields = [...prev.fields];
            const currentOptions = nextFields[fieldIndex].options || [];
            if (!currentOptions.includes(text)) {
                nextFields[fieldIndex] = {
                    ...nextFields[fieldIndex],
                    options: [...currentOptions, text]
                };
            }
            return { ...prev, fields: nextFields };
        });

        setNewOptionInput((prev) => ({ ...prev, [fieldIndex]: '' }));
    };

    const handleRemoveOptionFromField = (fieldIndex, optIndex) => {
        setFormTemplate((prev) => {
            const nextFields = [...prev.fields];
            const currentOptions = nextFields[fieldIndex].options || [];
            nextFields[fieldIndex] = {
                ...nextFields[fieldIndex],
                options: currentOptions.filter((_, i) => i !== optIndex)
            };
            return { ...prev, fields: nextFields };
        });
    };

    // Save Template
    const handleSaveTemplate = async (e) => {
        e.preventDefault();
        if (!formTemplate.name.trim()) {
            alert('Please give your template a name.');
            return;
        }

        if (formTemplate.fields.length === 0) {
            alert('Please add at least one field to this registration form template.');
            return;
        }

        const templateId = editingTemplateId || `custom_${Date.now()}`;
        const templateData = {
            id: templateId,
            name: formTemplate.name.trim(),
            description: formTemplate.description.trim(),
            type: formTemplate.type,
            hasPayment: Boolean(formTemplate.hasPayment),
            defaultFee: Number(formTemplate.defaultFee) || 0,
            qrCodeImage: formTemplate.qrCodeImage || '',
            paymentAmount: formTemplate.paymentAmount?.trim() || '',
            paymentInstructions: formTemplate.paymentInstructions?.trim() || '',
            badge: 'Custom',
            isBuiltin: false,
            fields: formTemplate.fields.map((f, i) => ({
                id: f.id || `field_${i}_${createFieldSlug(f.label)}`,
                label: f.label || `Field ${i + 1}`,
                type: f.type || 'text',
                required: Boolean(f.required),
                placeholder: f.placeholder || '',
                helpText: f.helpText || '',
                options: Array.isArray(f.options) ? f.options : []
            }))
        };

        try {
            // Save to Firestore and local storage
            await saveRegistrationTemplate(templateData);
            saveLocalTemplate(templateData);

            await loadAllTemplates();
            setIsEditorOpen(false);
            alert('Registration template saved successfully!');
        } catch (err) {
            console.error('Error saving template:', err);
            saveLocalTemplate(templateData);
            await loadAllTemplates();
            setIsEditorOpen(false);
            alert('Template saved locally!');
        }
    };

    const filteredTemplates = templates.filter((t) => {
        if (activeFilter === 'builtin') return t.isBuiltin;
        if (activeFilter === 'custom') return !t.isBuiltin;
        return true;
    });

    return (
        <div className="admin-dashboard-section admin-dashboard-templates-section">
            <div className="admin-dashboard-section-header">
                <div>
                    <h3 className="admin-dashboard-section-title">Registration Form Templates</h3>
                    <p style={{ margin: '4px 0 0', color: 'rgba(255,255,255,0.7)', fontSize: '0.9rem' }}>
                        Manage pre-built event forms (Wright Flight, Drone Competition, Standard) or create custom templates with tailor-made fields.
                    </p>
                </div>
                <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                        type="button"
                        className="admin-dashboard-add-btn"
                        onClick={handleOpenCreate}
                    >
                        <FaPlus style={{ marginRight: '6px' }} />
                        Create New Template
                    </button>
                </div>
            </div>

            {/* Filter pills */}
            <div style={{ display: 'flex', gap: '8px', margin: '20px 0 16px' }}>
                <button
                    type="button"
                    className={`template-filter-btn ${activeFilter === 'all' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('all')}
                >
                    All Templates ({templates.length})
                </button>
                <button
                    type="button"
                    className={`template-filter-btn ${activeFilter === 'builtin' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('builtin')}
                >
                    Built-in ({templates.filter((t) => t.isBuiltin).length})
                </button>
                <button
                    type="button"
                    className={`template-filter-btn ${activeFilter === 'custom' ? 'active' : ''}`}
                    onClick={() => setActiveFilter('custom')}
                >
                    Custom Templates ({templates.filter((t) => !t.isBuiltin).length})
                </button>
            </div>

            {loading ? (
                <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                    Loading templates...
                </div>
            ) : filteredTemplates.length === 0 ? (
                <div className="admin-dashboard-gallery-empty admin-dashboard-gallery-empty-inline">
                    No templates found. Click "+ Create New Template" to design one with custom fields.
                </div>
            ) : (
                <div className="admin-dashboard-templates-grid">
                    {filteredTemplates.map((template) => (
                        <div key={template.id} className="template-card">
                            <div className="template-card-header">
                                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                    <span className={`template-badge ${template.isBuiltin ? 'badge-builtin' : 'badge-custom'}`}>
                                        {template.isBuiltin ? 'PRE-BUILT' : 'CUSTOM'}
                                    </span>
                                    <span className="template-type-badge">
                                        {template.type === 'team' ? (
                                            <>
                                                <FaUsers style={{ marginRight: '4px', fontSize: '0.8rem' }} /> Team Form
                                            </>
                                        ) : (
                                            <>
                                                <FaUser style={{ marginRight: '4px', fontSize: '0.8rem' }} /> Individual
                                            </>
                                        )}
                                    </span>
                                </div>
                                <span className="template-fields-count">
                                    {template.fields?.length || 0} Fields
                                </span>
                            </div>

                            <div className="template-card-body">
                                <h4 className="template-card-title">{template.name}</h4>
                                <p className="template-card-desc">{template.description || 'No description provided.'}</p>

                                <div className="template-fields-preview-tags">
                                    {(template.fields || []).slice(0, 5).map((f) => (
                                        <span key={f.id} className="field-tag">
                                            {f.label}
                                        </span>
                                    ))}
                                    {(template.fields || []).length > 5 && (
                                        <span className="field-tag more">
                                            +{template.fields.length - 5} more
                                        </span>
                                    )}
                                </div>
                            </div>

                            <div className="template-card-actions">
                                <button
                                    type="button"
                                    className="template-action-btn btn-preview"
                                    onClick={() => setPreviewTemplate(template)}
                                    title="Preview form"
                                >
                                    <FaEye style={{ marginRight: '4px' }} /> Preview
                                </button>
                                {onSelectTemplateForEvent && (
                                    <button
                                        type="button"
                                        className="template-action-btn btn-use-event"
                                        onClick={() => onSelectTemplateForEvent(template)}
                                        title="Create new event using this registration template"
                                        style={{ background: 'rgba(16, 185, 129, 0.2)', color: '#6ee7b7', borderColor: 'rgba(16, 185, 129, 0.4)' }}
                                    >
                                        <FaCheck style={{ marginRight: '4px' }} /> Use in Event
                                    </button>
                                )}
                                <button
                                    type="button"
                                    className="template-action-btn btn-duplicate"
                                    onClick={() => handleDuplicate(template)}
                                    title="Customize a copy of this template"
                                >
                                    <FaCopy style={{ marginRight: '4px' }} /> Copy / Customize
                                </button>
                                {!template.isBuiltin && (
                                    <>
                                        <button
                                            type="button"
                                            className="template-action-btn btn-edit"
                                            onClick={() => handleEditCustom(template)}
                                            title="Edit custom template"
                                        >
                                            <FaEdit />
                                        </button>
                                        <button
                                            type="button"
                                            className="template-action-btn btn-delete"
                                            onClick={() => handleDelete(template.id, template.name)}
                                            title="Delete custom template"
                                        >
                                            <FaTrash />
                                        </button>
                                    </>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* PREVIEW MODAL */}
            {previewTemplate && (
                <div
                    className="admin-dashboard-modal-backdrop"
                    onClick={() => setPreviewTemplate(null)}
                    role="presentation"
                >
                    <div
                        className="admin-dashboard-modal template-preview-modal"
                        role="dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <span className={`template-badge ${previewTemplate.isBuiltin ? 'badge-builtin' : 'badge-custom'}`}>
                                    {previewTemplate.isBuiltin ? 'PRE-BUILT TEMPLATE' : 'CUSTOM TEMPLATE'}
                                </span>
                                <h3 style={{ margin: '6px 0 2px' }}>{previewTemplate.name}</h3>
                                <p style={{ margin: 0, fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)' }}>
                                    {previewTemplate.description}
                                </p>
                            </div>
                            <button
                                type="button"
                                className="admin-dashboard-modal-close"
                                onClick={() => setPreviewTemplate(null)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="template-preview-body">
                            <div className="preview-form-card">
                                <div className="preview-notice">
                                    💡 This is a live visual preview of the fields registration attendees will see.
                                </div>

                                <div className="preview-fields-grid">
                                    {previewTemplate.fields?.map((field, idx) => (
                                        <div
                                            key={field.id || idx}
                                            className={`preview-field-box ${field.type === 'textarea' || field.type === 'file' ? 'full-width' : ''}`}
                                        >
                                            {/* QR code section above file upload fields */}
                                            {field.type === 'file' && previewTemplate.qrCodeImage && (
                                                <div className="template-payment-qr-section">
                                                    {previewTemplate.paymentAmount && (
                                                        <strong className="template-payment-total">
                                                            Total payable: {previewTemplate.paymentAmount}
                                                        </strong>
                                                    )}
                                                    {previewTemplate.paymentInstructions && (
                                                        <span className="template-payment-qr-label">
                                                            {previewTemplate.paymentInstructions}
                                                        </span>
                                                    )}
                                                    {!previewTemplate.paymentInstructions && (
                                                        <span className="template-payment-qr-label">Scan & Pay</span>
                                                    )}
                                                    <img
                                                        src={previewTemplate.qrCodeImage}
                                                        alt="Payment QR code"
                                                        className="template-payment-qr-image"
                                                    />
                                                </div>
                                            )}

                                            <label className="preview-label">
                                                {field.label}
                                                {field.required && <span className="req-star"> *</span>}
                                            </label>

                                            {field.type === 'select' ? (
                                                <select className="preview-input" disabled>
                                                    <option>Select {field.label}...</option>
                                                    {field.options?.map((opt, oi) => (
                                                        <option key={oi}>{opt}</option>
                                                    ))}
                                                </select>
                                            ) : field.type === 'textarea' ? (
                                                <textarea
                                                    className="preview-input"
                                                    rows="3"
                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                    disabled
                                                />
                                            ) : field.type === 'radio' ? (
                                                <div className="preview-radio-group">
                                                    {field.options?.map((opt, oi) => (
                                                        <label key={oi} className="preview-radio-label">
                                                            <input type="radio" disabled name={field.id} /> {opt}
                                                        </label>
                                                    ))}
                                                </div>
                                            ) : field.type === 'checkbox' ? (
                                                <div className="preview-checkbox-group">
                                                    <label className="preview-checkbox-label">
                                                        <input type="checkbox" disabled /> I agree / {field.label}
                                                    </label>
                                                </div>
                                            ) : field.type === 'file' ? (
                                                <div className="preview-file-upload">
                                                    <span>📁 Click or drag file here ({field.placeholder || 'Image / PDF'})</span>
                                                </div>
                                            ) : (
                                                <input
                                                    type={field.type || 'text'}
                                                    className="preview-input"
                                                    placeholder={field.placeholder || `Enter ${field.label}`}
                                                    disabled
                                                />
                                            )}

                                            {field.helpText && (
                                                <small className="preview-help-text">{field.helpText}</small>
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="admin-dashboard-modal-actions" style={{ padding: '16px 24px' }}>
                            <button
                                type="button"
                                className="admin-dashboard-modal-secondary"
                                onClick={() => setPreviewTemplate(null)}
                            >
                                Close Preview
                            </button>
                            <button
                                type="button"
                                className="admin-dashboard-modal-primary"
                                onClick={() => {
                                    const t = previewTemplate;
                                    setPreviewTemplate(null);
                                    handleDuplicate(t);
                                }}
                            >
                                Customize This Template
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* TEMPLATE BUILDER / EDITOR MODAL */}
            {isEditorOpen && (
                <div
                    className="admin-dashboard-modal-backdrop"
                    onClick={() => setIsEditorOpen(false)}
                    role="presentation"
                >
                    <div
                        className="admin-dashboard-modal template-builder-modal"
                        role="dialog"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="admin-dashboard-modal-header">
                            <div>
                                <p className="admin-dashboard-modal-kicker">Template Customizer</p>
                                <h3>{editingTemplateId ? 'Edit Registration Template' : 'Create Customizable Form Template'}</h3>
                            </div>
                            <button
                                type="button"
                                className="admin-dashboard-modal-close"
                                onClick={() => setIsEditorOpen(false)}
                            >
                                ×
                            </button>
                        </div>

                        <div className="template-builder-tabs">
                            <button
                                type="button"
                                className={`builder-tab ${editorTab === 'fields' ? 'active' : ''}`}
                                onClick={() => setEditorTab('fields')}
                            >
                                1. Form Fields ({formTemplate.fields.length})
                            </button>
                            <button
                                type="button"
                                className={`builder-tab ${editorTab === 'preview' ? 'active' : ''}`}
                                onClick={() => setEditorTab('preview')}
                            >
                                2. Live Form Preview
                            </button>
                        </div>

                        <form onSubmit={handleSaveTemplate} className="template-builder-form">
                            {editorTab === 'fields' ? (
                                <div className="template-builder-scroll">
                                    {/* Basic Info */}
                                    <div className="template-meta-section">
                                        <div className="meta-field-row">
                                            <label className="admin-dashboard-modal-field" style={{ flex: 2 }}>
                                                <span>Template Title *</span>
                                                <input
                                                    type="text"
                                                    value={formTemplate.name}
                                                    onChange={(e) => setFormTemplate({ ...formTemplate, name: e.target.value })}
                                                    placeholder="e.g. Aero Workshop 2026 / Hackathon Registration"
                                                    required
                                                />
                                            </label>

                                            <label className="admin-dashboard-modal-field" style={{ flex: 1 }}>
                                                <span>Registration Format</span>
                                                <select
                                                    value={formTemplate.type}
                                                    onChange={(e) => setFormTemplate({ ...formTemplate, type: e.target.value })}
                                                >
                                                    <option value="individual">Individual Registration</option>
                                                    <option value="team">Team Registration</option>
                                                </select>
                                            </label>
                                        </div>

                                        <label className="admin-dashboard-modal-field">
                                            <span>Form Description / Guidelines</span>
                                            <textarea
                                                rows="2"
                                                value={formTemplate.description}
                                                onChange={(e) => setFormTemplate({ ...formTemplate, description: e.target.value })}
                                                placeholder="Brief instructions shown at top of the registration page..."
                                            />
                                        </label>
                                    </div>

                                    {/* QR Code & Payment Settings */}
                                    <div className="template-qr-settings-section">
                                        <div className="template-qr-settings-header">
                                            <span className="template-qr-settings-title">💳 Payment &amp; QR Code Settings</span>
                                            <span className="template-qr-settings-badge">Optional</span>
                                        </div>
                                        <p className="template-qr-settings-hint">
                                            Upload a QR code image so participants can scan &amp; pay directly on the registration form — it will appear right above the screenshot upload field.
                                        </p>

                                        <div className="template-qr-upload-row">
                                            {formTemplate.qrCodeImage ? (
                                                <div className="template-qr-preview-box">
                                                    <img
                                                        src={formTemplate.qrCodeImage}
                                                        alt="QR code preview"
                                                        className="template-qr-preview-img"
                                                    />
                                                    <div className="template-qr-preview-actions">
                                                        <span className="template-qr-preview-label">QR code uploaded ✓</span>
                                                        <button
                                                            type="button"
                                                            className="template-qr-remove-btn"
                                                            onClick={() => setFormTemplate((prev) => ({ ...prev, qrCodeImage: '' }))}
                                                        >
                                                            Remove QR Code
                                                        </button>
                                                    </div>
                                                </div>
                                            ) : (
                                                <label className="template-qr-upload-label">
                                                    <span>📷 Upload QR Code Image (optional)</span>
                                                    <input
                                                        type="file"
                                                        accept="image/*"
                                                        style={{ display: 'none' }}
                                                        onChange={(e) => handleQrImageUpload(e.target.files?.[0])}
                                                    />
                                                    <div className="template-qr-drop-zone">
                                                        Click to select QR code image
                                                    </div>
                                                </label>
                                            )}
                                        </div>

                                        {formTemplate.qrCodeImage && (
                                            <div className="template-qr-meta-row">
                                                <label className="admin-dashboard-modal-field" style={{ flex: 1 }}>
                                                    <span>Payment Amount (shown above QR)</span>
                                                    <input
                                                        type="text"
                                                        value={formTemplate.paymentAmount}
                                                        onChange={(e) => setFormTemplate({ ...formTemplate, paymentAmount: e.target.value })}
                                                        placeholder="e.g. ₹500 per team"
                                                    />
                                                </label>
                                                <label className="admin-dashboard-modal-field" style={{ flex: 2 }}>
                                                    <span>Payment Instructions (shown above QR)</span>
                                                    <input
                                                        type="text"
                                                        value={formTemplate.paymentInstructions}
                                                        onChange={(e) => setFormTemplate({ ...formTemplate, paymentInstructions: e.target.value })}
                                                        placeholder="e.g. Scan & Pay via UPI, then upload screenshot below"
                                                    />
                                                </label>
                                            </div>
                                        )}

                                        {formTemplate.qrCodeImage && !formTemplate.fields.some((f) => f.type === 'file') && (
                                            <button
                                                type="button"
                                                className="preset-chip-btn"
                                                style={{ marginTop: '8px' }}
                                                onClick={() => handleAddField({ label: 'Payment Screenshot', type: 'file', required: true, helpText: 'Upload clear screenshot of the UPI transaction' })}
                                            >
                                                + Add Payment Screenshot field
                                            </button>
                                        )}
                                    </div>

                                    {/* Preset Quick Add Buttons */}
                                    <div className="template-presets-bar">
                                        <span className="presets-label">Quick Add Common Fields:</span>
                                        <div className="presets-list">
                                            {PRESET_CUSTOM_FIELDS.map((preset, pi) => (
                                                <button
                                                    key={pi}
                                                    type="button"
                                                    className="preset-chip-btn"
                                                    onClick={() => handleAddField(preset)}
                                                >
                                                    + {preset.label}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Fields List */}
                                    <div className="template-fields-list">
                                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                                            <h4 style={{ margin: 0, fontSize: '1rem', color: '#60a5fa' }}>
                                                Configured Form Fields ({formTemplate.fields.length})
                                            </h4>
                                            <button
                                                type="button"
                                                className="add-custom-field-btn"
                                                onClick={() => handleAddField()}
                                            >
                                                <FaPlus style={{ marginRight: '6px' }} /> Add Custom Field
                                            </button>
                                        </div>

                                        {formTemplate.fields.map((field, idx) => (
                                            <div key={idx} className="builder-field-card">
                                                <div className="field-card-top">
                                                    <div className="field-card-index">#{idx + 1}</div>
                                                    <div className="field-card-main-inputs">
                                                        <input
                                                            type="text"
                                                            className="field-name-input"
                                                            value={field.label}
                                                            onChange={(e) => handleUpdateField(idx, { label: e.target.value })}
                                                            placeholder="Field Label (e.g. Roll Number)"
                                                            required
                                                        />
                                                        <select
                                                            className="field-type-select"
                                                            value={field.type}
                                                            onChange={(e) => handleUpdateField(idx, { type: e.target.value })}
                                                        >
                                                            {FIELD_TYPES.map((ft) => (
                                                                <option key={ft.value} value={ft.value}>
                                                                    {ft.label}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </div>

                                                    <div className="field-card-toggles">
                                                        <label className="req-toggle-label">
                                                            <input
                                                                type="checkbox"
                                                                checked={field.required}
                                                                onChange={(e) => handleUpdateField(idx, { required: e.target.checked })}
                                                            />
                                                            Required
                                                        </label>

                                                        <div className="field-move-btns">
                                                            <button
                                                                type="button"
                                                                disabled={idx === 0}
                                                                onClick={() => handleMoveField(idx, -1)}
                                                                title="Move Up"
                                                            >
                                                                <FaArrowUp />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                disabled={idx === formTemplate.fields.length - 1}
                                                                onClick={() => handleMoveField(idx, 1)}
                                                                title="Move Down"
                                                            >
                                                                <FaArrowDown />
                                                            </button>
                                                            <button
                                                                type="button"
                                                                className="btn-remove-field"
                                                                onClick={() => handleRemoveField(idx)}
                                                                title="Delete Field"
                                                            >
                                                                <FaTrash />
                                                            </button>
                                                        </div>
                                                    </div>
                                                </div>

                                                <div className="field-card-details">
                                                    <div className="field-details-row">
                                                        <input
                                                            type="text"
                                                            className="field-sub-input"
                                                            value={field.placeholder || ''}
                                                            onChange={(e) => handleUpdateField(idx, { placeholder: e.target.value })}
                                                            placeholder="Placeholder text (e.g. Enter your college ID)"
                                                        />
                                                        <input
                                                            type="text"
                                                            className="field-sub-input"
                                                            value={field.helpText || ''}
                                                            onChange={(e) => handleUpdateField(idx, { helpText: e.target.value })}
                                                            placeholder="Help / Instruction note for attendee"
                                                        />
                                                    </div>

                                                    {/* Options manager for select, radio */}
                                                    {(field.type === 'select' || field.type === 'radio') && (
                                                        <div className="field-options-box">
                                                            <span className="options-title">Dropdown / Radio Options:</span>
                                                            <div className="options-chips">
                                                                {(field.options || []).map((opt, oi) => (
                                                                    <span key={oi} className="option-chip">
                                                                        {opt}
                                                                        <button
                                                                            type="button"
                                                                            onClick={() => handleRemoveOptionFromField(idx, oi)}
                                                                        >
                                                                            ×
                                                                        </button>
                                                                    </span>
                                                                ))}
                                                            </div>
                                                            <div className="add-option-inline">
                                                                <input
                                                                    type="text"
                                                                    value={newOptionInput[idx] || ''}
                                                                    onChange={(e) => setNewOptionInput({ ...newOptionInput, [idx]: e.target.value })}
                                                                    onKeyDown={(e) => {
                                                                        if (e.key === 'Enter') {
                                                                            e.preventDefault();
                                                                            handleAddOptionToField(idx);
                                                                        }
                                                                    }}
                                                                    placeholder="Type option name & press Add..."
                                                                />
                                                                <button
                                                                    type="button"
                                                                    onClick={() => handleAddOptionToField(idx)}
                                                                >
                                                                    + Add Option
                                                                </button>
                                                            </div>
                                                        </div>
                                                    )}
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                /* Tab 2: Live Form Preview */
                                <div className="template-builder-scroll">
                                    <div className="preview-form-card">
                                        <div className="preview-notice">
                                            👀 This is how attendees will see your customized "{formTemplate.name || 'Untitled Template'}" registration form.
                                        </div>

                                        <div className="preview-fields-grid">
                                            {formTemplate.fields.map((field, idx) => (
                                                <div
                                                    key={idx}
                                                    className={`preview-field-box ${field.type === 'textarea' || field.type === 'file' ? 'full-width' : ''}`}
                                                >
                                                    {/* QR code section above file upload fields */}
                                                    {field.type === 'file' && formTemplate.qrCodeImage && (
                                                        <div className="template-payment-qr-section">
                                                            {formTemplate.paymentAmount && (
                                                                <strong className="template-payment-total">
                                                                    Total payable: {formTemplate.paymentAmount}
                                                                </strong>
                                                            )}
                                                            {formTemplate.paymentInstructions && (
                                                                <span className="template-payment-qr-label">
                                                                    {formTemplate.paymentInstructions}
                                                                </span>
                                                            )}
                                                            {!formTemplate.paymentInstructions && (
                                                                <span className="template-payment-qr-label">Scan & Pay</span>
                                                            )}
                                                            <img
                                                                src={formTemplate.qrCodeImage}
                                                                alt="Payment QR code"
                                                                className="template-payment-qr-image"
                                                            />
                                                        </div>
                                                    )}

                                                    <label className="preview-label">
                                                        {field.label}
                                                        {field.required && <span className="req-star"> *</span>}
                                                    </label>

                                                    {field.type === 'select' ? (
                                                        <select className="preview-input" disabled>
                                                            <option>Select {field.label}...</option>
                                                            {field.options?.map((opt, oi) => (
                                                                <option key={oi}>{opt}</option>
                                                            ))}
                                                        </select>
                                                    ) : field.type === 'textarea' ? (
                                                        <textarea
                                                            className="preview-input"
                                                            rows="3"
                                                            placeholder={field.placeholder || `Enter ${field.label}`}
                                                            disabled
                                                        />
                                                    ) : field.type === 'radio' ? (
                                                        <div className="preview-radio-group">
                                                            {field.options?.map((opt, oi) => (
                                                                <label key={oi} className="preview-radio-label">
                                                                    <input type="radio" disabled name={field.id} /> {opt}
                                                                </label>
                                                            ))}
                                                        </div>
                                                    ) : field.type === 'checkbox' ? (
                                                        <div className="preview-checkbox-group">
                                                            <label className="preview-checkbox-label">
                                                                <input type="checkbox" disabled /> I agree / {field.label}
                                                            </label>
                                                        </div>
                                                    ) : field.type === 'file' ? (
                                                        <div className="preview-file-upload">
                                                            <span>📁 Click or drag file here ({field.placeholder || 'Image / PDF'})</span>
                                                        </div>
                                                    ) : (
                                                        <input
                                                            type={field.type || 'text'}
                                                            className="preview-input"
                                                            placeholder={field.placeholder || `Enter ${field.label}`}
                                                            disabled
                                                        />
                                                    )}

                                                    {field.helpText && (
                                                        <small className="preview-help-text">{field.helpText}</small>
                                                    )}
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            )}

                            <div className="admin-dashboard-modal-actions">
                                <button
                                    type="button"
                                    className="admin-dashboard-modal-secondary"
                                    onClick={() => setIsEditorOpen(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="admin-dashboard-modal-primary"
                                >
                                    {editingTemplateId ? 'Save Changes' : 'Create Template'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
