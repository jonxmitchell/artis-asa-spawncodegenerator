import React, { useState, useEffect } from "react";
import {
  Button,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Input,
  Tooltip,
  ScrollShadow,
} from "@nextui-org/react";
import {
  BookmarkPlus,
  Trash2,
  FolderOpen,
  FileUp,
  AlertCircle,
  X,
} from "lucide-react";
import { open } from "@tauri-apps/api/dialog";

const SavedLocations = ({ isOpen, onClose, onLocationSelect }) => {
  const [savedLocations, setSavedLocations] = useState([]);
  const [newLocation, setNewLocation] = useState({ name: "", path: "" });
  const [inputError, setInputError] = useState({ name: "", path: "" });
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);

  useEffect(() => {
    const stored = localStorage.getItem("modLocations");
    if (stored) {
      setSavedLocations(JSON.parse(stored));
    }
  }, []);

  const handleFileSelect = async () => {
    try {
      const selected = await open({
        multiple: false,
        filters: [
          {
            name: "Manifest File",
            extensions: ["txt", "*"],
          },
        ],
      });

      if (selected) {
        setNewLocation({ ...newLocation, path: selected });
        setInputError({ ...inputError, path: "" });
      }
    } catch (err) {
      console.error("Failed to select file:", err);
      setInputError({ ...inputError, path: "Failed to select file" });
    }
  };

  const validateInputs = () => {
    const errors = { name: "", path: "" };
    let isValid = true;

    if (!newLocation.name.trim()) {
      errors.name = "Name is required";
      isValid = false;
    }

    if (!newLocation.path.trim()) {
      errors.path = "Path is required";
      isValid = false;
    }

    if (
      savedLocations.some(
        (loc) => loc.name.toLowerCase() === newLocation.name.toLowerCase()
      )
    ) {
      errors.name = "Name already exists";
      isValid = false;
    }

    setInputError(errors);
    return isValid;
  };

  const saveLocation = () => {
    if (validateInputs()) {
      const updatedLocations = [...savedLocations, { ...newLocation }];
      setSavedLocations(updatedLocations);
      localStorage.setItem("modLocations", JSON.stringify(updatedLocations));
      setNewLocation({ name: "", path: "" });
      setInputError({ name: "", path: "" });
    }
  };

  const removeLocation = (index) => {
    const updatedLocations = savedLocations.filter((_, i) => i !== index);
    setSavedLocations(updatedLocations);
    localStorage.setItem("modLocations", JSON.stringify(updatedLocations));
    setShowDeleteConfirm(null);
  };

  const handleLocationSelect = (path) => {
    if (onLocationSelect) {
      onLocationSelect(path);
      onClose();
    }
  };

  const handleModalClose = () => {
    setNewLocation({ name: "", path: "" });
    setInputError({ name: "", path: "" });
    setShowDeleteConfirm(null);
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      size="lg"
      classNames={{
        base: "max-h-[90vh]",
        header: "border-none",
        footer: "border-none",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-lg font-bold">Manage Saved Locations</h2>
          <p className="text-sm text-gray-400">
            Save and manage your frequently used manifest file locations
          </p>
        </ModalHeader>
        <ModalBody>
          <div className="space-y-6">
            <div className="bg-content2 p-4 rounded-lg space-y-4">
              <h3 className="text-sm font-semibold">Add New Location</h3>
              <div className="space-y-3">
                <Input
                  label="Location Name"
                  placeholder="Enter a name for this location"
                  value={newLocation.name}
                  onChange={(e) => {
                    setNewLocation({ ...newLocation, name: e.target.value });
                    setInputError({ ...inputError, name: "" });
                  }}
                  errorMessage={inputError.name}
                  isInvalid={!!inputError.name}
                  startContent={
                    <BookmarkPlus className="w-4 h-4 text-gray-400" />
                  }
                />
                <Input
                  label="File Path"
                  placeholder="Enter or select the file path"
                  value={newLocation.path}
                  onChange={(e) => {
                    setNewLocation({ ...newLocation, path: e.target.value });
                    setInputError({ ...inputError, path: "" });
                  }}
                  errorMessage={inputError.path}
                  isInvalid={!!inputError.path}
                  startContent={
                    <FolderOpen className="w-4 h-4 text-gray-400" />
                  }
                  endContent={
                    <Button
                      isIconOnly
                      variant="light"
                      size="sm"
                      onPress={handleFileSelect}
                    >
                      <FileUp className="w-4 h-4" />
                    </Button>
                  }
                />
                <Button
                  color="primary"
                  onPress={saveLocation}
                  className="w-full"
                  startContent={<BookmarkPlus className="w-4 h-4" />}
                >
                  Save Location
                </Button>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold mb-3">Saved Locations</h3>
              <ScrollShadow className="max-h-[300px]" hideScrollBar>
                {savedLocations.length === 0 ? (
                  <div className="flex flex-col items-center justify-center p-8 bg-content2 rounded-lg">
                    <AlertCircle className="w-8 h-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-400 text-center">
                      No locations saved yet
                      <br />
                      Add your first location above
                    </p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {savedLocations.map((location, index) => (
                      <div
                        key={index}
                        className="group flex items-start justify-between p-3 bg-content2 rounded-lg hover:bg-content3 transition-all duration-200"
                      >
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <h4 className="font-medium text-sm">
                              {location.name}
                            </h4>
                          </div>
                          <p className="text-xs text-gray-400 truncate mt-1">
                            {location.path}
                          </p>
                        </div>
                        <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Tooltip content="Use this location">
                            <Button
                              isIconOnly
                              size="sm"
                              variant="light"
                              className="text-primary"
                              onPress={() =>
                                handleLocationSelect(location.path)
                              }
                            >
                              <FolderOpen className="w-4 h-4" />
                            </Button>
                          </Tooltip>
                          {showDeleteConfirm === index ? (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                color="danger"
                                variant="flat"
                                onPress={() => removeLocation(index)}
                              >
                                Delete
                              </Button>
                              <Button
                                isIconOnly
                                size="sm"
                                variant="light"
                                onPress={() => setShowDeleteConfirm(null)}
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </div>
                          ) : (
                            <Tooltip content="Remove location">
                              <Button
                                isIconOnly
                                size="sm"
                                color="danger"
                                variant="light"
                                onPress={() => setShowDeleteConfirm(index)}
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </Tooltip>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </ScrollShadow>
            </div>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={handleModalClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default SavedLocations;
