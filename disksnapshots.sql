SELECT
   i.imageGuid,
   i.creationDate,
   i.size,
   s.snapshotId,
   s.description,
   s.creationDate,
   vm.vmName,
   vm.vmGuid,
   bd.diskAlias,
   bd.diskId
FROM Image i
JOIN i.storageDomains sd              -- Join to filter by storage domain
LEFT JOIN i.vmSnapshot s              -- Image is part of a VM Snapshot
LEFT JOIN s.vm vm                     -- VM Snapshot belongs to a VM
LEFT JOIN i.baseDisk bd               -- Image belongs to a BaseDisk (logical disk)
WHERE 1=1
AND sd.id = :storageDomainId
AND i.vmSnapshot IS NOT NULL          -- Ensure we are only getting images that are part of a VM snapshot
									  -- (distinguishing from active disks or templates if they are also in 'images' table
									  -- and don't have vm_snapshot_id populated)
-- AND s.description != 'Active VM'
AND i.active = false                  -- Often, snapshots are marked as active=false. Verify this logic for your setup. The active disk image is usually active=true.

SELECT
    i.image_guid AS disk_snapshot_id,
    i.creation_date AS disk_snapshot_image_creation_date, -- Creation date of the disk image
    i.size as disk_snapshot_size,
    s.snapshot_id AS vm_snapshot_id,
    s.description AS vm_snapshot_description,          -- VM Snapshot's description
    s.creation_date AS vm_snapshot_creation_date,    -- VM Snapshot's creation date
    vm.vm_name AS connected_vm_name,
    vm.vm_guid AS connected_vm_id, 
    bd.disk_alias AS original_disk_alias,
    bd.disk_id AS original_disk_id
FROM
    images i
JOIN
    image_storage_domain_map isdm ON i.image_guid = isdm.image_id
JOIN
    snapshots s ON i.vm_snapshot_id = s.snapshot_id -- Link disk image to its VM snapshot
LEFT JOIN -- Use LEFT JOIN in case a disk image is somehow not part of a VM snapshot (though rare for disk_snapshots)
    vm_static vm ON s.vm_id = vm.vm_guid           -- Get VM details
LEFT JOIN
    base_disks bd ON i.image_group_id = bd.disk_id -- image_group_id links all images of a single disk
WHERE
    isdm.storage_domain_id = '17de0683-c800-4afc-8413-8ee13f354adf' -- Your Storage Domain ID
and i.active = false;