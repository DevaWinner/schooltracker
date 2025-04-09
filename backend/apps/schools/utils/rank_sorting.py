def rank_numeric_conversion(institution, last_rank_end):
    """
    Helper function to convert the rank of an institution to a numeric value.
    It handles both single numeric ranks and range-based ranks (e.g., '500-550').
    """
    rank = institution.rank
    if 'na' in rank:
        return (999999, rank)  # Treat 'na' as the lowest rank
    
    if '-' in rank:
        # For rank ranges, return the first number in the range and keep the full range string
        start, end = rank.split('-')
        return (int(start), rank)  # Return the start of the range and the full range string
    
    try:
        # For a single number, treat it as the numeric value
        return (int(rank), rank)
    except ValueError:
        return (999999, rank)  # For invalid ranks, treat them as the lowest rank


def filter_and_sort_institutions(queryset):
    """
    This function takes a queryset of institutions, processes the rank field,
    and sorts the institutions based on rank while keeping the full rank string.
    """
    last_rank_end = 0
    sorted_institutions = []

    for institution in queryset:
        rank_numeric, rank = rank_numeric_conversion(institution, last_rank_end)

        # If we are dealing with a range, we want to maintain the 'last_rank_end'
        if isinstance(rank, str) and '-' in rank:
            # If the rank is a range, update the last rank end with the end of the range
            _, end = rank.split('-')
            last_rank_end = int(end)  # Save the last number in the range
        else:
            # If the rank is a single value, update last_rank_end accordingly
            last_rank_end = rank_numeric  # Update for individual ranks

        sorted_institutions.append((rank_numeric, rank, institution))

    # Sort by rank first, maintaining the range string order
    sorted_institutions.sort(key=lambda x: x[0])

    # Return only the institutions, maintaining the original order after sorting
    return [institution for _, _, institution in sorted_institutions]
