Jekyll::Hooks.register :site, :pre_render do |site|
    # Retrieve the latest modified date for the tierlist
    current_file_path = Pathname.new(__FILE__)
    tierlist_file_path = current_file_path.parent.parent.to_s + "/_data/tierlist.json"
    last_modified_date = File.mtime(tierlist_file_path)

    # Place the modified date within site object for reference
    site.data['tierlist_last_modified_date'] = last_modified_date
end