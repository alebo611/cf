<h1>Blog shoes</h1>
<?php echo $this->Html->link(
    'Add Item',
    array('controller' => 'shoes', 'action' => 'add')
); ?>
<table>
    <tr>
        <th>Name</th>
        <th>color</th>
        <th>size</th>
        <th>In stock</th>
    </tr>

    <!-- Here is where we loop through our $shoes array, printing out shoe info -->

    <?php foreach ($shoes as $shoe): ?>
    <tr>
        <td>
            <?php echo $this->Html->link($shoe['Shoe']['name'],
array('controller' => 'shoes', 'action' => 'view', $shoe['Shoe']['id'])); ?>
        </td>
        <td><?php echo $shoe['Shoe']['color']; ?></td>
        <td><?php echo $shoe['Shoe']['size']; ?></td>
        <td>
            <?php echo $this->Html->link($shoe['Shoe']['in_stock'],
array('controller' => 'shoes', 'action' => 'edit', $shoe['Shoe']['id'])); ?>
        

        </td>
         <td>
            <?php
                echo $this->Form->postLink(
                    'Delete',
                    array('action' => 'delete', $shoe['Shoe']['id']),
                    array('confirm' => 'Are you sure?')
                );
            ?>
        </td>
    </tr>
    <?php endforeach; ?>
    <?php unset($shoe); ?>
</table>
