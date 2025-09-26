'use client';

import { useState } from 'react';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface CreateListModalProps {
    isOpen: boolean;
    onClose: () => void;
    onCreateList: (name: string) => void;
}

export function CreateListModal({ isOpen, onClose, onCreateList }: CreateListModalProps) {
    const [listName, setListName] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (listName.trim()) {
            onCreateList(listName.trim());
            setListName('');
        }
    };

    const handleCancel = () => {
        setListName('');
        onClose();
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="create-list-modal">
                <DialogHeader>
                    <DialogTitle className="create-list-modal-title">Create New List</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="create-list-modal-form">
                    <div className="create-list-modal-input-group">
                        <Label htmlFor="listName" className="create-list-modal-label">
                            List Name
                        </Label>
                        <Input
                            id="listName"
                            type="text"
                            value={listName}
                            onChange={(e) => setListName(e.target.value)}
                            placeholder="Enter list name..."
                            className="create-list-modal-input"
                            autoFocus
                        />
                    </div>

                    <div className="create-list-modal-button-group">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleCancel}
                            className="create-list-modal-cancel-button"
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            disabled={!listName.trim()}
                            className="create-list-modal-create-button"
                        >
                            Create List
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}